const express = require('express');
const Stripe = require("stripe")

const stripe = Stripe(process.env.STRIPE_KEY)


require("dotenv").config();
const router = express.Router()


router.post('/create-checkout-session', async(req, res) => {
    const customer = await stripe.customers.create({
        metadata: {
            userId: req.body.userId.toString(),
            cart: JSON.stringify(req.body.CartItems.toString())
        }
    })
    const line_items = req.body.CartItems.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: [item.image.url],
                    description: item.desc,
                    metadata: {
                        id: item._id
                    }
                },
                unit_amount: item.price * 100,
            },
            quantity: item.cartQuantity,
        }
    })

    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({ url: session.url });
});


// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
// const stripe = require('stripe')('sk_test_...');


// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;
    if (endpointSecret) {
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Webhook verified")
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        data = event.data.object;
        eventType = event.type;
    } else {
        data = req.body.data.object;
        eventType = req.body.type
    }
    if (eventType === "checkout.session.completed") {
        stripe.customers.retrive(data.customer).then((customer) => {
            console.log(customer);
            console.log("data", data);
        }).catch((err) => console.log(err.message))
    }
    // Handle the event

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
});

// app.listen(4242, () => console.log('Running on port 4242'));

module.exports = router;