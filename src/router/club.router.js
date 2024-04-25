const express = require('express');
const multer = require('multer');
const Club = require('../model/club.model');
const Company = require('../model/company.model');

const router = express.Router();

const upload = multer({ dest: 'uploads/' }); 

router.post('/club', upload.single('club_img'), async (req, res) => {
  try {
    const { company_nif, club_name, club_rules, club_description, club_schedule } = req.body;
    const club_img = req.file.path; 

    // Verifica si la compañía existe
    const company = await Company.findOne({ where: { company_nif } });
    if (!company) {
      return res.status(404).json({ error: 'La compañía no existe' });
    }

    // Crea el club asociado a la compañía
    const club = await Club.create({
      club_owner: company_nif,
      club_name,
      club_rules,
      club_description,
      club_schedule,
      club_img
    });

    return res.status(201).json(club);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/clubs', async (req, res) => {
  const clubData = req.body;
  await Club.sync();
  const updateClub = await Club.create({
    club_name: clubData.club_name,
    club_rules: clubData.club_rules,
    club_description: clubData.club_description,
    company_nif: clubData.company_nif,
    club_schedule: clubData.club_schedule 
  });
  res.status(201).json({
    ok: true,
    status: 201,
    message: 'Created Client'
  });
});

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

router.put('/club/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { company_nif, club_name, club_rules, club_description, club_schedule, club_img } = req.body;
    const club = await Club.findOne({ where: { id: id } });

    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }

    club.company_nif = company_nif;
    club.club_name = club_name;
    club.club_rules = club_rules;
    club.club_description = club_description;
    club.club_schedule = club_schedule;
    club.club_img = club_img;

    await club.save();

    res.status(200).json({
      ok: true,
      status: 200,
      message: 'Club updated successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;