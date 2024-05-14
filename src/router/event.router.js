const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Event = require("../model/event.model");
const multer = require('multer');
const { Op } = require('sequelize');
const path = require('path');
const express = require('express');
const Ticket = require("../model/ticket.model")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public')); // Ruta para guardar las imágenes
    },
    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });



  router.post('/events', upload.single('event_image'), async (req, res) => {
    try {
        const eventData = req.body;
        console.log(eventData.tickets);
        const imagePath = req.file ? `/public/${req.file.filename}` : null;
        const createdEvent = await Event.create({
            event_name: eventData.event_name,
            event_description: eventData.event_description,
            event_date: eventData.event_date,
            event_image: imagePath,
            club_id: eventData.club_id
        });
  
        const lastEvent = await Event.findOne({
            order: [['createdAt', 'DESC']]
        });
  
        for (const ticketData of eventData.tickets) {
            await Ticket.create({
                ticket_name: ticketData.ticket_name,
                ticket_price: ticketData.ticket_price,
                ticket_quantity: ticketData.ticket_quantity,
                event_id: lastEvent.event_id 
            });
        }
  
        res.status(201).json({
            ok: true,
            status: 201,
            message: 'Created Event and Tickets'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: 'Internal Server Error'
        });
    }
  });

  router.put("/events/edit/:eventId", upload.single('event_image'), async (req, res) => {
    const eventId = req.params.eventId;
    const { event_name, event_description, event_date, event_time } = req.body;
  
    try {
      let eventDataToUpdate = {
        event_name,
        event_description,
        event_date,
        event_time,
      };
  
      if (req.file) {
        eventDataToUpdate.event_image = '/public/' + req.file.filename;
      }
  
      const updatedEvent = await Event.update(eventDataToUpdate, {
        where: {
          event_id: eventId
        }
      });
  
      res.status(200).json({
        ok: true,
        status: 200,
        body: updatedEvent,
        message: "Evento actualizado exitosamente"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.get("/findevents", async (req, res) => {
    try {
        const events = await Event.findAll();

        res.status(200).json({
            ok: true,
            status: 200,
            body: events
        });
    } catch (error) {
        console.error('Error al buscar eventos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post("/events", async (req, res) => {
  try {
    const eventData = req.body;
    const newEvent = await Event.create(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error al crear el evento:", error);
    res.status(500).send("Hubo un error al crear el evento. Por favor, inténtalo de nuevo más tarde.");
  }
});
router.put("/event/delete", async (req, res) => {
  const eventId = req.body.event_id;
  try {
      const deletedEvent = await Event.destroy({
          where: {
              event_id: eventId
          }
      });

      if (deletedEvent === 0) {
          return res.status(404).send("No se encontró ningún evento con el ID proporcionado.");
      }

      res.send(`Se ha eliminado el evento con el ID: ${eventId}`);
  } catch (error) {
      console.error("Error al eliminar el evento:", error);
      res.status(500).send("Hubo un error al eliminar el evento. Por favor, inténtalo de nuevo más tarde.");
  }
});
router.put("/event/toggle-state", async (req, res) => {
  const eventID = req.body;

  try {
      const event = await Event.findByPk(eventID.event_id);
      if (!event) {
          return res.status(404).json({ error: 'Event not found' });
      }

      event.client_state = !event.client_state; 

      await event.save();

      res.status(200).json({ message: 'Club state toggled successfully', client_state: event.client_state });
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while toggling event state' });
  }
});

router.post('/eventDetails', async (req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.status(200).json({
      ok: true,
      status: 200,
      body: event,
      message: "Detalles del evento"
    });
  } catch (error) {
    console.error('Error al obtener los detalles del evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get("/clubEvents/:clubId", async (req, res) => {
  const clubId = req.params.clubId;
  try {
    const currentDate = new Date();
    const events = await Event.findAll({
      where: {
        club_id: clubId,
        event_date: {
          [Op.gt]: currentDate // Filtrar eventos con fecha posterior a la actual
        }
      }
    });

    res.status(200).json({
      ok: true,
      status: 200,
      body: events
    });
  } catch (error) {
    console.error('Error al buscar eventos del club:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
