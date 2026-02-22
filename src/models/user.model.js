const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        select: false
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);