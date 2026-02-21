const History = require("../models/history.model");

exports.getHistory = async (req, res, next) => {
    try {
        const {
            type,
            action,
            // user,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (type) query.type = type;
        if (action) query.action = action;
        // if (user) query.user = user;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const history = await History.find(query)
            // .populate("user", "fullName email role")
            .sort({ date: -1 })
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