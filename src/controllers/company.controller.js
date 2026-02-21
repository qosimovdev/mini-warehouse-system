const Company = require("../models/company.model");
const History = require("../models/history.model");

exports.createCompany = async (req, res, next) => {
    try {
        const { name, phone, address } = req.body;

        const exist = await Company.findOne({ name });
        if (exist) return res.status(400).json({ message: "Company already exists" });

        const company = await Company.create({ name, phone, address });

        await History.create({
            type: "COMPANY",
            action: "CREATED",
            // user: req.user.id,
            newData: company
        });

        res.status(201).json({ success: true, company });
    } catch (err) {
        next(err);
    }
};

exports.getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find().sort({ name: 1 });
        res.status(200).json({ success: true, count: companies.length, companies });
    } catch (err) {
        next(err);
    }
};

exports.updateCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: "Company not found" });

        const oldData = { ...company._doc };

        const { name, phone, address } = req.body;
        if (name) company.name = name;
        if (phone) company.phone = phone;
        if (address) company.address = address;

        await company.save();

        await History.create({
            type: "COMPANY",
            action: "UPDATED",
            // user: req.user.id,
            oldData,
            newData: company
        });

        res.status(200).json({ success: true, company });
    } catch (err) {
        next(err);
    }
};

exports.deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: "Company not found" });

        await company.deleteOne();

        await History.create({
            type: "COMPANY",
            action: "DELETED",
            // user: req.user.id,
            oldData: company
        });

        res.status(200).json({ success: true, message: "Company deleted" });
    } catch (err) {
        next(err);
    }
};