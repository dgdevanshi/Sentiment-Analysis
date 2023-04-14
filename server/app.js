const express = require("express");
const mongoose = require("mongoose");
const {spawn} = require("child_process");

const companySchema = require("./models/company");

const PORT = process.env.PORT || 3696;
const app = express();
const DB = "mongodb+srv://dg325:7cKarDuMHNHxnhbn@companies.yp9t9ui.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
    res.render("home");
});


app.get("/company", (req, res) => {
    let data1;
    const input = req.query.company;
    const py = spawn("python", ["crawler.py"]);
    py.stdin.write(input);
    py.stdin.end(); 
    py.stdout.on("data", (data) => {
        data1 = data.toString()
    });
    py.on("close", (code) => {
        res.send(data1)
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