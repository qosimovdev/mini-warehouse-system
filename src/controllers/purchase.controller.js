const Purchase = require("../models/purchase.model");
const Product = require("../models/product.model");
const Company = require("../models/company.model");
const History = require("../models/history.model");

// exports.createPurchase = async (req, res, next) => {
//     try {
//         const { company, product, quantity, price, paid } = req.body;
//         const comp = await Company.findById(company);
//         if (!comp) return res.status(404).json({ message: "Company not found" });
//         const prod = await Product.findById(product);
//         if (!prod) return res.status(404).json({ message: "Product not found" });
//         const total = quantity * price;
//         const debt = total - (paid || 0);
//         const purchase = await Purchase.create({
//             company,
//             product,
//             quantity,
//             price,
//             paid: paid || 0,
//             total,
//             debt,
//             createdBy: req.user.id
//         });
//         prod.stock += quantity;
//         prod.averagePrice =
//             ((prod.averagePrice * (prod.stock - quantity)) + (price * quantity)) / prod.stock;

//         await prod.save();
//         await History.create({
//             type: "PURCHASE",
//             action: "CREATED",
//             user: req.user.id,
//             newData: purchase
//         });
//         res.status(201).json({
//             success: true,
//             message: "Purchase created",
//             purchase
//         });
//     } catch (err) {
//         next(err);
//     }
// };

exports.createPurchase = async (req, res, next) => {
    try {
        const { company, items, paid = 0 } = req.body;

        const comp = await Company.findById(company);
        if (!comp) {
            return res.status(404).json({ message: "Company not found" });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Items required" });
        }

        let total = 0;

        const calculatedItems = [];

        for (const item of items) {
            const prod = await Product.findById(item.product);
            if (!prod) {
                return res.status(404).json({ message: "Product not found" });
            }

            const itemTotal = item.quantity * item.price;
            total += itemTotal;

            calculatedItems.push({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                total: itemTotal
            });

            prod.stock += item.quantity;

            prod.averagePrice =
                ((prod.averagePrice * (prod.stock - item.quantity)) +
                    item.price * item.quantity) /
                prod.stock;

            await prod.save();
        }

        if (paid > total) {
            return res.status(400).json({
                message: "Paid amount cannot be greater than total"
            });
        }

        const debt = total - paid;

        comp.debt = (comp.debt || 0) + debt;
        await comp.save();

        const purchase = await Purchase.create({
            company,
            items: calculatedItems,
            total,
            paid,
            debt,
            createdBy: req.user.id
        });

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
            .populate("items.product", "name")
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
        const prod = await Product.findById(purchase.product);
        if (quantity !== undefined) {
            prod.stock = prod.stock - purchase.quantity + quantity;
            purchase.quantity = quantity;
        }
        if (price !== undefined) purchase.price = price;
        if (paid !== undefined) purchase.paid = paid;
        const total = purchase.quantity * purchase.price;
        const debt = total - (purchase.paid || 0);
        purchase.total = total;
        purchase.debt = debt;
        await prod.save();
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