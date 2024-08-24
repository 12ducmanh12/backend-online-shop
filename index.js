const express = require('express')
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const register = require("./routes/register")
const login = require("./routes/login")
const overviewRoute = require('./routes/overview')
const analyze = require('./routes/analyze')
const productsRoute = require('./routes/products')
const stripe = require("./routes/stripe")
require("dotenv").config()
app.use(express.json())

app.use(cors())

app.use("/api/register", register)

app.use("/api/login", login)
app.use("/api/overview", overviewRoute)
app.use("/api/products", productsRoute)
app.use("/api/dashboard", analyze)
app.use("/api/stripe", stripe)


app.get("/", (req, res) => {
    res.send("welcome to our online shop API...")
});


const port = process.env.port || 5000;
const uri = process.env.DB_URI
app.listen(port, console.log(`Server running on port ${port}`))

mongoose.connect(uri, {}).then(() => console.log("MongoDB connection successfull...")).catch((err) => console.log("MongoDB connection failed", err.message))