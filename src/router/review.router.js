const router = require("express").Router();
const Ticket = require("../model/ticket.model");
const Event = require("../model/event.model")
const Client= require("../model/client.model")
const Sells =require("../model/sells.model");
const Reviews =require("../model/reviews.model")

router.post("/reviews", async (req, res) => {
    const dataReview = req.body;

    const newReview = await Reviews.create({
        review_data: dataReview.review_data,
        review_value: dataReview.review_value,
        client_id: dataReview.client_id,
        club_id: dataReview.club_id,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    res.status(201).json({
        ok: true,
        status: 201,
        message: "Created Review"
    });
});

module.exports = router;

module.exports = router;