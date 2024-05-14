const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Ticket = require("../model/ticket.model");
const Event = require("../model/event.model")
const multer = require('multer');
const Client= require("../model/client.model")
const Sells =require("../model/sells.model");
const { UUIDV4 } = require("sequelize");
const upload = multer({ dest: 'uploads/' }); 
const { v4: uuidv4 } = require('uuid');


router.post('/ticketsid', async (req, res) => {
  try {
    const { ticketName } = req.body;

    const ticket = await Ticket.findOne({
      where: {
        ticket_name: ticketName
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ ticketId: ticket.ticket_id });
  } catch (error) {
    console.error('Error al buscar ticket por nombre:', error);
    res.status(500).json({ error: 'Error al buscar ticket por nombre' });
  }
});


router.post('/add-sell', async (req, res) => {
  try {
    const { client_email, sell_total_price, ticket_id, qr_guests } = req.body;

    const client = await Client.findOne({
      where: {
        client_email: client_email
      }
    });
    console.log(client)

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    const sell_id = uuidv4();
    const sell = await Sells.create({
      client_id: client.client_id,
      sell_total_price: sell_total_price,
      qr_guests: qr_guests,
      ticket_id: ticket_id,
      qr_code: `QR_CODE_${sell_id}`
    });

    res.json(sell);
  } catch (error) {
    console.error('Error al agregar la venta:', error);
    res.status(500).json({ error: 'Error al agregar la venta' });
  }
});


router.post('/tickets', async (req, res) => {
  try {
      const eventId = req.body.eventId;
      const tickets = await Ticket.findAll({
          where: {
              event_id: eventId,
          },
      });
      res.json(tickets);
  } catch (error) {
      console.error('Error al buscar tickets:', error);
      res.status(500).json({ error: 'Error al buscar tickets' });
  }
});

router.post('/sells-by-email', async (req, res) => {
  try {
    const { client_email } = req.body;
    console.log("+++++++++++++++++++++++++++++++++++++++++" + client_email)
    const client = await Client.findOne({where: {client_email: client_email } });
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++" + client.client_id)

const sells = await Sells.findAll({ where: { client_id: client.client_id } });

console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++" + sells); 

res.json(sells);

  } catch (error) {
    console.error('Error al obtener las ventas del cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
router.post('/sells-by-ticket', async (req, res) => {
  try {
    const { ticket_id } = req.body;

    const sell = await Sells.findOne({ ticket_id });
    if (!sell) {
      return res.status(404).json({ error: 'Venta no encontrada para el ticket ID proporcionado' });
    }

    const ticket = await Ticket.findOne({ _id: ticket_id });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado para el ticket ID proporcionado' });
    }

    const event = await Event.findOne({ _id: ticket.event_id });
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado para el ticket ID proporcionado' });
    }

    res.json({
      sell,
      ticket_name: ticket.ticket_name,
      event
    });
  } catch (error) {
    console.error('Error al obtener la venta y los datos del evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


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