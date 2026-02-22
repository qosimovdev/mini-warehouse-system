const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/generateToken");

exports.register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const exists = await User.findOne({ email: normalizedEmail });
        if (exists) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
            role: "USER"
        });
        res.status(201).json({ success: true });
    } catch (err) {
        next(err);
    }
};


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            accessToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role
            }
        });

    } catch (err) {
        next(err);
    }
};


exports.refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token)
            return res.sendStatus(403);

        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });

    } catch {
        res.sendStatus(403);
    }
};


exports.logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

    const user = await User.findOne({ refreshToken: token });
    if (user) {
        user.refreshToken = null;
        await user.save();
    }

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
};