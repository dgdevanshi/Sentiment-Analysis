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
            console.log("Here 1");
            let data2;
            for (let key in myObj) {
                for (let i in myObj[key]) {
                    let l = myObj[key][i].toString();
                    py2 = spawn("python", ["scraper.py", l]);
                    function processHeadlines() {
                        return new Promise((resolve, reject) => {
                            py2.stdout.on("data", async (data) => {
                                console.log("Here 2");
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
    
            console.log("Here 4");
            
            if (company) {
                for (let key in myObj) {
                    for (let i in company.links) {
                        const newsName = company.links[i].newsName;
                        if (newsName === key) {
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
    let data1;
    let input = req.query.company;
    input = input.toLowerCase();
    const company = await Company.findOne({name: input});

        let {newHeadlines,py} = await processHeadlines(input,data1,company);

        py.on("close", (code) => { 
            console.log("Crawled, Scraped and Saved") 
        });
    const py3 = spawn("python", ["predict.py"]);
    test = company.headlines.toString();
    // test = newHeadlines.toString();
    py3.stdin.end();

    function predictSentiment() {
        return new Promise((resolve, reject) => {
            py3.stdout.on("data", async (data) => {
                let data3 = data.toString();
                res.send("Sentiment: " + data3);
                resolve();
            });
        });
    }
    await predictSentiment();
    py3.on("close", (code) => {
        console.log("Predicted")
    });

    // let companyLink=[];
    // for( let element in company.links){
    //     let newsLinkArray=element['newsLink'];
    //     companyLink.push({
    //         newsName:element['newsName'],
    //         newsLink:newsLinkArray[newsLinkArray.length-1]});
    // }
    
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