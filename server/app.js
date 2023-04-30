const express = require("express");
const mongoose = require("mongoose");
const {spawn} = require("child_process");
const Company = require("./models/company");
const cors = require("cors");
const PORT = process.env.PORT || 3696;
const app = express();
const DB = "mongodb+srv://dg325:7cKarDuMHNHxnhbn@companies.yp9t9ui.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
    res.render("home");
});

async function crawlLinks(input, data1, company) {
    console.log('crawlLinks');
    return new Promise((resolve, reject) => {
        let newHeadlines='';
        let newPrice='';
        py = spawn("python", ["crawler.py"]);
        py.stdin.write(input);
        py.stdin.end();
        py.stdout.on("data", async (data) => {
            data1 = data.toString();
            const myObj = JSON.parse(data1)
            console.log(myObj);
            let newLinks = []
            for (let key in myObj) {
                newLinks.push({newsName: key, newsLink: myObj[key]})
            }
            let data2;
            for (let key in myObj) {
                let firstTime=false;
                for (let i in myObj[key]) {
                    if(firstTime){break;}
                    firstTime=true;
                    let l = myObj[key][i].toString();
                    if (l.includes("moneycontrol.com")) {
                        py4 = spawn("python", ["price-scraper.py", l]);
                        function processPrice() {
                            return new Promise((resolve, reject) => {
                                py4.stdout.on("data", async (data)  => {
                                    newPrice = data.toString();
                                    console.log(newPrice);
                                    resolve();
                                });
                            });
                        }
                        await processPrice();
                        py4.on("close", (req, res) => {});
                    } else {
                        console.log("hello world");
                        if(l.includes("livemint")&&l.includes("share-price-nse-bse")){
                            console.log("NSE BSE");
                            firstTime=false;
                            continue;
                        }
                        console.log("doosre links called");
                        py2 = spawn("python", ["scraper.py", l]);
                        function processHeadlines() {
                            console.log("andar 1");
                            return new Promise((resolve, reject) => {
                                py2.stdout.on("data", async (data) => {
                                    console.log("andar 2");
                                    data2 = data.toString();
                                    console.log(data2);
                                    newHeadlines += data2
                                    resolve(); 
                                });
                            });
                        }
                        await processHeadlines();              
                        py2.on("close", (req, res) => {})
                    }
                }
            }
            if (company) {
                for (let key in myObj) {
                    for (let i in company.links) {
                        const newsName = company.links[i].newsName;
                        if (newsName === key) {
                            console.log(newsName);           
                            if(company.links[i].newsLink.includes(...myObj[key]))
                            {break;}
                            company.links[i].newsLink.push(...myObj[key]);
                            company.headlines += newHeadlines;
                            break;
                        }
                    }
                    await company.save() 
                }
            } else {
                let newCompany = new Company({name: input, links: newLinks, headlines: newHeadlines});
                await newCompany.save(); 
            }
            resolve({py, newPrice});
        });    
    });
}

app.get("/company", async (req, res) => {
    try{
        let data1;
        let input = req.query.company;
        input = input.toLowerCase();
        const company = await Company.findOne({name: input});
        let {py, newPrice} = await crawlLinks(input, data1, company);
        py.on("close", (code) => { 
            console.log("Crawled, Scraped and Saved") 
        });
        console.log("Prediction Started")
        const py3 = spawn("python", ["predict.py"]);
        const company2 = await Company.findOne({name: input});
        test = company2.headlines.toString();
        py3.stdin.write(test);
        py3.stdin.end();
        let model_predictions = []
        function predictSentiment() {
            return new Promise((resolve, reject) => {
                py3.stdout.on("data", async (data) => {
                    console.log("in py3");
                    let data3 = data.toString();
                    const preds = JSON.parse(data3);
                    for (i in preds) {
                        model_predictions.push({modelName: i, prediction: preds[i]});
                    }
                    resolve();
                });
            });
        }
        await predictSentiment();
        py3.on("close", (code) => {
            console.log(model_predictions);
            console.log("Predicted");
        });

        //fetching media house name and their latest newsLink
        let companyLink=[];
        for( let index in company2.links){
            let newsLinkArray=company2.links[index].newsLink;
            companyLink.push({
                newsName:company2.links[index].newsName,
                newsLink:newsLinkArray[newsLinkArray.length-1]});
        }

        // add current price, and model wise prediction
        let jsonBody={name:input, companyLink, predictions: model_predictions, price: newPrice };
        res.send(jsonBody);
    } catch(e) {
        res.status(500).send({msg:"Something went wrong"});
        console.log(e.toString);
    }
});


mongoose.set("strictQuery", false);
mongoose
    .connect(DB)
    .then(() => {
    console.log("Connection Successful");
    })
    .catch((e) => {
    console.log(e);
    });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
});