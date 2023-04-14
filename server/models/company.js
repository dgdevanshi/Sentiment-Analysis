const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
    name: {
    type: String
    },
    links: {
        newsName: {type: String},
        newsLink: [{type: String}], 
    }
});

const Company = mongoose.model("company", companySchema);
module.exports = companySchema;