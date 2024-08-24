const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    nameProduct: { type: String, required: true },
    byUser: { type: String, required: true },
    brand: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    Date: { type: Date, required: true },
}, { timestamps: true });

const Orders = mongoose.model("orders", ordersSchema)
exports.Orders = Orders;