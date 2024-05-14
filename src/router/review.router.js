const router = require("express").Router();
const Ticket = require("../model/ticket.model");
const Event = require("../model/event.model")
const Client= require("../model/client.model")
const Sells =require("../model/sells.model");
const Reviews =require("../model/reviews.model")

router.post("/reviews", async (req, res) => {
    const dataReview = req.body;
    const ticket = await Ticket.findOne({ 
        where: { ticket_id: dataReview.ticket_id }
      });
    const event = await Event.findOne({
        where: { event_id: ticket.event_id }
      });

    const newReview = await Reviews.create({
        review_data: dataReview.review_data,
        review_value: dataReview.review_value,
        client_id: dataReview.client_id,
        club_id: event.club_id,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    res.status(201).json({
        ok: true,
        status: 201,
        message: "Created Review"
    });
});

router.post('/client-reviews', async (req, res) => {
    try {
      const { client_email } = req.body;
  
      const client = await Client.findOne({ 
        where: { client_email: client_email }
      });

      const reviews = await Reviews.findAll({ 
        where: { client_id: client.client_id }
      });
  
      res.status(200).json({
        ok: true,
        status: 200,
        reviews: reviews
      });
    } catch (error) {
      console.error('Error al obtener las reseñas del cliente:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  router.post('/club-reviews', async (req, res) => {
    try {
      const { club_id } = req.body;
  
      const reviews = await Reviews.findAll({
        where: { club_id: club_id }
      });
  
      res.status(200).json({
        ok: true,
        status: 200,
        reviews: reviews
      });
    } catch (error) {
      console.error('Error al obtener las reseñas del club:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
module.exports = router;