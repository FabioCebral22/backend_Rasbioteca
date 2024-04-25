const router = require("express").Router();
const Club = require("../model/club.model");
const Company = require("../model/company.model");
const jwt = require("jsonwebtoken")

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
    club_schedule: clubData.club_schedule // Asegúrate de agregar club_schedule aquí
  });
  res.status(201).json({
    ok: true,
    status: 201,
    message: "Created Client"
  });
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
    res.status(200).json(clubs);
    console.log('+++++++++++++++++++++++++'+ clubs)
  } catch (error) {
    console.error('Error al obtener los clubes de la compañía:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
module.exports = router;
