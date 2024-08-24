const express = require("express")
const cloudinary = require("../utils/clouldinary")
const router = express.Router();
const { Product } = require("../models/products")
const { isAdmin } = require("../middleware/auth")

router.post("/", isAdmin, async(req, res) => {
    const { name, brand, shortDesc, longDesc, price, image } = req.body;
    try {
        if (image) {
            const uploadRes = await cloudinary.uploader.upload(image, { upload_preset: "AdminUpload" })
            if (uploadRes) {
                const product = new Product({
                    name,
                    brand,
                    shortDesc,
                    longDesc,
                    price,
                    image: uploadRes
                })
                const saveProduct = await product.save()
                res.status(200).send(saveProduct)
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})
router.put("/:_id", isAdmin, async(req, res) => {
    const { _id } = req.params;
    const { name, brand, shortDesc, price, image } = req.body;
    try {
        let updatedData = { name, brand, shortDesc, price };

        if (image) {
            const imageDelete = await Product.findById(_id);
            await cloudinary.uploader.destroy(imageDelete.image.public_id);
            const uploadRes = await cloudinary.uploader.upload(image, { upload_preset: "AdminUpload" });
            if (uploadRes) {
                updatedData.image = uploadRes;
            }
        }
        const updatedProduct = await Product.findByIdAndUpdate(_id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
router.delete("/:_id", async(req, res) => {
    const { _id } = req.params;
    try {
        const image = await Product.findById(_id);
        await cloudinary.uploader.destroy(image.image.public_id);
        const deleteProduct = await Product.findByIdAndDelete(_id);
        res.status(200).send(deleteProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})


router.get("/", async(req, res) => {
    try {
        const product = await Product.find()
        res.status(200).send(product)
    } catch (error) {
        res.status(500).send(error);
    }

})
module.exports = router