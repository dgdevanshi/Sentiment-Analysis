const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
    name: { type: String },
    links:[
        {newsName:{type:String}, newsLink:[{type:String}]}
    ]
});

const Company = mongoose.model("Company", companySchema);
module.exports = Company;