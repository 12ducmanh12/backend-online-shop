const express = require("express")
const router = express.Router()
const { Orders } = require("../models/orders")

router.get("/revenue-by-brand", async(req, res) => {
    try {
        const result = await Orders.aggregate([
            { $match: { paymentStatus: "done" } }, // Filter documents with paymentStatus "done"
            { $group: { _id: "$brand", totalRevenue: { $sum: "$price" } } }, // Group by brand and sum the prices
            { $project: { _id: 0, brand: "$_id", totalRevenue: 1 } }, // Project the result to rename _id to brand
            { $sort: { totalRevenue: 1 } }
        ]);
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router