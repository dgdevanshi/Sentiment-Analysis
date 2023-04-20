const express = require("express");
const mongoose = require("mongoose");
const {spawn} = require("child_process");

const Company = require("./models/company");

const PORT = process.env.PORT || 3696;
const app = express();
const DB = "mongodb+srv://dg325:7cKarDuMHNHxnhbn@companies.yp9t9ui.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
    res.render("home");
});

async function processHeadlines(input,data1,company) {
    return new Promise((resolve, reject) => {
        let newHeadlines='';
        py = spawn("python", ["crawler.py"]);
        py.stdin.write(input);
        py.stdin.end();
        py.stdout.on("data", async (data) => {
            data1 = data.toString()
            const myObj = JSON.parse(data1)
            let newLinks = []
            for (let key in myObj) {
                newLinks.push({newsName: key, newsLink: myObj[key]})
            }
            let data2;
            for (let key in myObj) {
                for (let i in myObj[key]) {
                    let l = myObj[key][i].toString();
                    py2 = spawn("python", ["scraper.py", l]);
                    function processHeadlines() {
                        return new Promise((resolve, reject) => {
                            py2.stdout.on("data", async (data) => {
                                data2 = data.toString();
                                newHeadlines += data2
                                resolve(); 
                            });
                        });
                    }
                    await processHeadlines();              
                    py2.on("close", (req, res) => {
                    })
                }
            }
    
            
            if (company) {
                for (let key in myObj) {
                    for (let i in company.links) {
                        const newsName = company.links[i].newsName;
                        if (newsName === key) {
                            console.log(newsName);
                            console.log("NewsName above");
                            
                            if(company.links[i].newsLink.includes(...myObj[key]))
                            {break;}
                            company.links[i].newsLink.push(...myObj[key]);
                            company.headlines += newHeadlines;
                            break
                        }
                    }
                    await company.save() 
                }
            } else {
                let newCompany = new Company({name: input, links: newLinks, headlines: newHeadlines});
                await newCompany.save(); 
            }
            console.log('end of func');
            resolve({newHeadlines,py});
        });    
    });
  }




app.get("/company", async (req, res) => {
    try{

        let data1;
    let input = req.query.company;
    input = input.toLowerCase();
    const company = await Company.findOne({name: input});

        let {newHeadlines,py} = await processHeadlines(input,data1,company);
        
        py.on("close", (code) => { 
            console.log("Crawled, Scraped and Saved") 
        });
    console.log("heree")
    const py3 = spawn("python", ["predict.py"]);
    const company2 = await Company.findOne({name: input});
    test = company2.headlines.toString();
    console.log(test)
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
    for( let index in company.links){
        let newsLinkArray=company.links[index].newsLink;
        companyLink.push({
            newsName:company.links[index].newsName,
            newsLink:newsLinkArray[newsLinkArray.length-1]});
    }

    // add current price, and model wise prediction
    res.send({
        name:input,
        companyLink
    });
    } catch(e){
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