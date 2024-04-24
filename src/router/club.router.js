const router = require("express").Router();
const Club = require("../model/club.model");
const Company = require("../model/company.model");

router.post("/club", async (req, res) => {
  try {
    const { company_nif, club_name, club_rules, club_description, club_schedule } = req.body;
    // Verifica si la compañía existe
    const company = await Company.findOne({ where: { company_nif } });
    if (!company) {
      return res.status(404).json({ error: "La compañía no existe" });
    }
    // Crea el club asociado a la compañía
    const club = await Club.create({
      club_owner: company_nif,
      club_name,
      club_rules,
      club_description,
      club_schedule
    });
    return res.status(201).json(club);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/clubs", async (req, res) => {
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
    message: "Created Client"
  });
});

module.exports = router;
