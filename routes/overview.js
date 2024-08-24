const express = require("express")
const router = express.Router();
const { User } = require("../models/user")
const { Orders } = require("../models/orders")
router.get("/number_user", async(req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).send([userCount])
    } catch (error) {
        res.status(500).send(error);
    }
})
router.get("/number_order", async(req, res) => {
    try {
        const orderCount = await Orders.countDocuments({ paymentStatus: "done" });
        res.status(200).send([orderCount])
    } catch (error) {
        res.status(500).send(error);
    }
})
router.get("/revenue", async(req, res) => {
    try {
        const result = await Orders.aggregate([
            { $match: { paymentStatus: "done" } }, // Filter documents with paymentStatus "done"
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } } // Sum the prices
        ]);
        // Extract the total revenue from the result
        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
        res.status(200).send([totalRevenue])
    } catch (error) {
        res.status(500).send(error);
    }
})
module.exports = router