const router = require("express").Router();
const Club = require("../model/club.model");
const Company = require("../model/company.model");
const Event = require("../model/event.model")
const jwt = require("jsonwebtoken");
const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/'));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post('/clubs', upload.single('club_img'), async (req, res) => {
  const clubData = req.body;
  await Club.sync();
  const updateClub = await Club.create({
    club_name: clubData.club_name,
    club_rules: clubData.club_rules,
    club_description: clubData.club_description,
    company_nif: clubData.company_nif,
    club_schedule: clubData.club_schedule,
    club_img: req.file ? '/public/' + req.file.filename : null
  });
  res.status(201).json({
    ok: true,
    status: 201,
    message: 'Created Client'
  });
});
//CONSEGUIR EL NIF DE LA EMPRESA
router.post("/company/nif", async (req, res) => {
  try {
    const { company_email } = req.body;
    const company = await Company.findOne({
      where: {
        company_email: company_email
      }
    });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json({
      ok: true,
      status: 200,
      company_nif: company.company_nif
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get("/findclubs", async (req, res) => {
    const clubs = await Club.findAll()
    res.status(200).json({
        ok: true,
        status: 200,
        body: clubs
    })
});
router.get("/companyclubs", async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  const { company_email } = req.body;
  try {
    
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded.companyData)
    console.log(decoded.companyData.company_email)
    const company = await Company.findOne({
       where: { company_email: decoded.companyData.company_email } 
    });
    console.log('----------------------'+company.company_nif)
    if (!company) {
      return res.status(404).json({ error: 'Compañía no encontrada' });
    }
    const clubs = await Club.findAll({ where: { company_nif: company.company_nif } });
    res.status(200).json({
      ok: true,
      status: 200,
      body: clubs,
      message: "Owned clubs"
    });
    console.log('+++++++++++++++++++++++++'+ clubs)
  } catch (error) {
    console.error('Error al obtener los clubes de la compañía:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//EDITAR UN CLUB

router.put("/club/edit", async (req, res) => {
  const id = req.params.club_id;
  const dataClub=req.body;
  const updatedClub = await Club.update({
      club_name: dataClub.club_name   ,
      club_rules: dataClub.club_rules,
      club_description: dataClub.club_description,
      club_img: dataClub.club_img,
  },
  {
      where: {
          club_id:id,
      }
  }
  );
  res.status(200).json({
      ok: true,
      status: 200,
      body: updatedClub,
      message: "Updated Client"
  })
})
router.put("/club/delete", async (req, res) => {
  const clubId = req.body.club_id;
  console.log("+++++++++++++++++++++++++++++++++++++++" + clubId)
  try {
      const deletedClub = await Club.destroy({
          where: {
              club_id: clubId
          }
      });

      if (deletedClub === 0) {
          return res.status(404).send("No se encontró ningún club con el ID proporcionado.");
      }

      res.send(`Se ha eliminado el club con el ID: ${clubId}`);
  } catch (error) {
      console.error("Error al eliminar el club:", error);
      res.status(500).send("Hubo un error al eliminar el club. Por favor, inténtalo de nuevo más tarde.");
  }
});
router.put("/clubs/toggle-state", async (req, res) => {
  const clubId = req.body;

  try {
      const club = await Club.findByPk(clubId.club_id);
      if (!club) {
          return res.status(404).json({ error: 'Club not found' });
      }

      club.club_status = !club.club_status; 

      await club.save();

      res.status(200).json({ message: 'Club state toggled successfully', club_status: club.club_status });
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while toggling club state' });
  }
});

router.post('/clubDetails', async (req, res) => {
  const { clubId } = req.body;
  try {
      const club = await Club.findByPk(clubId);
      if (!club) {
          return res.status(404).json({ error: 'Club not found' });
      }
      res.status(200).json({
        ok: true,
        status: 200,
        body: club,
        message: "Club Details"
    });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/club/all', async (req, res) => {
  try {
      const clubs = await Club.findAll();
      res.status(200).json(clubs);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching clubs' });
  }
});
router.post('/clubs/events', async (req, res) => {
  const { club_id } = req.body; // Corregido para que coincida con el campo club_id enviado desde el frontend
  console.log("Club ID:", club_id); // Verifica que recibas correctamente club_id en el servidor
  try {
    const club = await Club.findByPk(club_id);
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    const events = await Event.findAll({ where: { club_id: club_id } }); // Corregido para usar club_id
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching club events:', error);
    res.status(500).json({ error: 'An error occurred while fetching club events' });
  }
});


module.exports = router;