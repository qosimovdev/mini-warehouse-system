const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number },
    paid: { type: Number, default: 0 },
    debt: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

purchaseSchema.pre("save", function () {
    if (this.isModified("quantity") || this.isModified("price") || this.isModified("paid")) {
        this.total = this.quantity * this.price;
        this.debt = this.total - this.paid;
    }
});

module.exports = mongoose.model("Purchase", purchaseSchema);
