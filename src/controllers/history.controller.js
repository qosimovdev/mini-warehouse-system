// const History = require("../models/history.model");
// exports.getHistory = async (req, res, next) => {
//     try {
//         const {
//             company,
//             product,
//             type,
//             action,
//             user,
//             startDate,
//             endDate,
//             page = 1,
//             limit = 10
//         } = req.query;

//         const query = {};

//         if (type) query.type = type;
//         if (action) query.action = action;
//         if (user) query.user = user;

//         if (startDate || endDate) {
//             query.createdAt = {};
//             if (startDate) query.createdAt.$gte = new Date(startDate);
//             if (endDate) query.createdAt.$lte = new Date(endDate);
//         }

//         if (company) {
//             query["newData.company"] = company;
//         }

//         if (product) {
//             query["newData.items.product"] = product;
//         }

//         const skip = (page - 1) * limit;

//         const history = await History.find(query)
//             .populate("user", "fullName email role")
//             .populate("newData.company", "name")
//             .populate("newData.items.product", "name")
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(Number(limit));
//         const total = await History.countDocuments(query);

//         res.status(200).json({
//             success: true,
//             total,
//             page: Number(page),
//             pages: Math.ceil(total / limit),
//             history
//         });

//     } catch (err) {
//         next(err);
//     }
// };const mongoose = require("mongoose");
const History = require("../models/history.model");

exports.getHistory = async (req, res, next) => {
    try {
        const {
            company,
            product,
            type,
            action,
            user,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (type) query.type = type;
        if (action) query.action = action;
        if (user) query.user = user;

        if (company && mongoose.Types.ObjectId.isValid(company)) {
            query["newData.company"] = new mongoose.Types.ObjectId(company);
        }

        if (product && mongoose.Types.ObjectId.isValid(product)) {
            query["newData.items.product"] = new mongoose.Types.ObjectId(product);
        }

        if (startDate || endDate) {
            query.createdAt = {};

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                query.createdAt.$gte = start;
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const skip = (page - 1) * limit;

        const history = await History.find(query)
            .populate([
                { path: "user", select: "fullName email role" },
                { path: "newData.company", select: "name" },
                { path: "newData.items.product", select: "name" }
            ])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await History.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            history
        });

    } catch (err) {
        next(err);
    }
};