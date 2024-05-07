const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Event = require("../model/event.model");
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 



router.post('/events', upload.single('event_img'), async (req, res) => {
    const eventData = req.body;
    const updateEvent = await Event.create({
      event_name: eventData.event_name,
      event_description: eventData.event_description,
      event_date: eventData.event_date,
      event_img: req.file ? req.file.path : null,
      club_id:eventData.club_id
    });
    res.status(201).json({
      ok: true,
      status: 201,
      message: 'Created Event'
    });
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



module.exports = router;
