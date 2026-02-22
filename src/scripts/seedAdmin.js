require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

mongoose.connect(process.env.MONGO_URI);
const createAdmin = async () => {
    const email = "admin@example.com";
    const fullName = "Super Admin";
    const password = "Admin123!";
    const exists = await User.findOne({ email });
    if (exists) {
        console.log("Admin already exists");
        process.exit();
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: "ADMIN"
    });
    console.log("Admin created successfully");
    process.exit();
};
createAdmin();