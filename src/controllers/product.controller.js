const Product = require("../models/product.model");
const History = require("../models/history.model");

exports.createProduct = async (req, res, next) => {
    try {
        const { name, stock = 0, averagePrice = 0 } = req.body;
        const exist = await Product.findOne({ name });
        if (exist) return res.status(400).json({ message: "Product already exists" });
        const product = await Product.create({ name, stock, averagePrice });
        await History.create({
            type: "PRODUCT",
            action: "CREATED",
            user: req.user.id,
            newData: product
        });
        res.status(201).json({ success: true, product });
    } catch (err) {
        next(err);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ name: 1 });
        res.status(200).json({ success: true, count: products.length, products });
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        const oldData = { ...product._doc };
        const { name, stock, averagePrice } = req.body;
        if (name) product.name = name;
        if (stock !== undefined) product.stock = stock;
        if (averagePrice !== undefined) product.averagePrice = averagePrice;
        await product.save();
        await History.create({
            type: "PRODUCT",
            action: "UPDATED",
            user: req.user.id,
            oldData,
            newData: product
        });
        res.status(200).json({ success: true, product });
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        await product.deleteOne();
        await History.create({
            type: "PRODUCT",
            action: "DELETED",
            user: req.user.id,
            oldData: product
        });
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (err) {
        next(err);
    }
};