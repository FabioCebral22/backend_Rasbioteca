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
module.exports = router;