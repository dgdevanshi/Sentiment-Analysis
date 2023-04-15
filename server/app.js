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


app.get("/company", async (req, res) => {
    let data1;
    let input = req.query.company;
    input = input.toLowerCase();
    const py = spawn("python", ["crawler.py"]);
    py.stdin.write(input);
    py.stdin.end(); 
    py.stdout.on("data", (data) => {
        data1 = data.toString()
    });
    py.on("close", async (code) => {
        res.send(data1)
        const myObj = JSON.parse(data1);
        let newLinks = []
        for (let key in myObj) {
            newLinks.push({newsName: key, newsLink: myObj[key]})
        }
        const company = await Company.findOne({name: input});
        if (company) {
            for (let key in myObj) {
                company.links.forEach(link => {
                const newsName = link.newsName;
                const newsLink = link.newsLink;
                if (newsName === key) {
                    newsLink.push(myObj[key]);
                } else {
                    company.links.push({key, newsLink: myObj[key]})
                }
                })
            }
            company.save()
        } else {
            let newCompany = new Company({name: input, links: newLinks});
            newCompany.save(); 
        }
    });
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