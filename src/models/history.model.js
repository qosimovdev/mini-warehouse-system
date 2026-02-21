const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    type: { type: String, enum: ["PURCHASE", "PRODUCT", "COMPANY"], required: true },
    action: { type: String, enum: ["CREATED", "UPDATED", "DELETED"], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    oldData: { type: Object },
    newData: { type: Object }
});

module.exports = mongoose.model("History", historySchema);
