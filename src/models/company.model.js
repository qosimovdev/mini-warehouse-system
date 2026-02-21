const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
