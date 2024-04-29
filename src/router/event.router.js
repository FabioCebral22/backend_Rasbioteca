const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Event = require("../model/event.model");
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); 



router.post('/events', upload.single('event_img'), async (req, res) => {
    const eventData = req.body;
    const updateEvent = await Event.create({
      event_name: eventData.club_name,
      event_description: eventData.club_description,
      event_date: eventData.club_schedule,
      event_img: req.file ? req.file.path : null,
      club_id:eventData.club_id
    });
    res.status(201).json({
      ok: true,
      status: 201,
      message: 'Created Event'
    });
  });
  
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    res.status(500).send("Hubo un error al obtener los eventos. Por favor, inténtalo de nuevo más tarde.");
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


module.exports = router;
