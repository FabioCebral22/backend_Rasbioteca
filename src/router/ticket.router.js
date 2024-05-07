const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Ticket = require("../model/ticket.model");
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 

router.post('/tickets', async (req, res) => {
  const dataTicket = req.body;

  try {
    const newTicket = await Ticket.create({
      ticket_name: dataTicket.ticket_name,
      ticket_price: dataTicket.ticket_price,
      ticket_quantity: dataTicket.ticket_quantity,
      event_id: dataTicket.event_id
    });

    res.status(201).json({ message: 'Ticket creado exitosamente', ticket: newTicket });
  } catch (error) {
    console.error('Error al crear el ticket:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/tickets', async (req, res) => {
    const ticketData = req.body;
    const updateTicket = await Ticket.create({
      ticket_price: eventData.event_name,
      qr_code: eventData.qr_code,
    });
    res.status(201).json({
      ok: true,
      status: 201,
      message: 'Created Ticket'
    });
  }); 

  router.get('alltickets', async(req, res) =>{
  })

module.exports = router;