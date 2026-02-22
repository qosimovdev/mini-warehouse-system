const Purchase = require("../models/purchase.model");
const Product = require("../models/product.model");
const Company = require("../models/company.model");
const History = require("../models/history.model");

exports.createPurchase = async (req, res, next) => {
    try {
        const { company, product, quantity, price, paid } = req.body;
        const comp = await Company.findById(company);
        if (!comp) return res.status(404).json({ message: "Company not found" });
        const prod = await Product.findById(product);
        if (!prod) return res.status(404).json({ message: "Product not found" });
        const purchase = await Purchase.create({
            company,
            product,
            quantity,
            price,
            paid,
            createdBy: req.user.id
        });
        prod.stock += quantity;
        prod.averagePrice = ((prod.averagePrice * (prod.stock - quantity)) + (price * quantity)) / prod.stock;
        await prod.save();
        await History.create({
            type: "PURCHASE",
            action: "CREATED",
            user: req.user.id,
            newData: purchase
        });
        res.status(201).json({
            success: true,
            message: "Purchase created",
            purchase
        });
    } catch (err) {
        next(err);
    }
};

exports.getPurchases = async (req, res, next) => {
    try {
        const purchases = await Purchase.find()
            .populate("company", "name")
            .populate("product", "name")
            .populate("createdBy", "fullName")
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: purchases.length,
            purchases
        });
    } catch (err) {
        next(err);
    }
};

exports.updatePurchase = async (req, res, next) => {
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) return res.status(404).json({ message: "Purchase not found" });
        const oldData = { ...purchase._doc };
        const { quantity, price, paid } = req.body;
        if (quantity !== undefined) {
            const prod = await Product.findById(purchase.product);
            prod.stock = prod.stock - purchase.quantity + quantity;
            await prod.save();
            purchase.quantity = quantity;
        }
        if (price !== undefined) purchase.price = price;
        if (paid !== undefined) purchase.paid = paid;
        await purchase.save();
        await History.create({
            type: "PURCHASE",
            action: "UPDATED",
            user: req.user.id,
            oldData,
            newData: purchase
        });
        res.status(200).json({
            success: true,
            message: "Purchase updated",
            purchase
        });
    } catch (err) {
        next(err);
    }
};

exports.deletePurchase = async (req, res, next) => {
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) return res.status(404).json({ message: "Purchase not found" });
        const prod = await Product.findById(purchase.product);
        prod.stock -= purchase.quantity;
        await prod.save();
        await History.create({
            type: "PURCHASE",
            action: "DELETED",
            user: req.user.id,
            oldData: purchase
        });
        await purchase.deleteOne();
        res.status(200).json({
            success: true,
            message: "Purchase deleted"
        });
    } catch (err) {
        next(err);
    }
};