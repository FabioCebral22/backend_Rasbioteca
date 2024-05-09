const { faker } = require("@faker-js/faker")
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Company = require("../model/company.model");
const multer = require('multer');
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');

// Configurar multer para manejar la subida de archivos
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
  
  // Ruta para editar la compañía
  router.put("/company/edit/:companyId", upload.single('company_img'), async (req, res) => {
    const companyId = req.params.companyId;
  
    try {
      // Buscar la compañía por su ID
      const company = await Company.findByPk(companyId);
  
      // Verificar si la compañía existe
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
  
      // Actualizar los datos de la compañía con los nuevos valores del formulario
      company.company_name = req.body.company_name;
      company.company_info = req.body.company_info;
  
      // Si se cargó una nueva imagen de perfil de la compañía, actualizarla
      if (req.file) {
        company.company_img = '/public/' + req.file.filename; // Ruta de la nueva imagen
      }
  
      // Guardar los cambios en la base de datos
      await company.save();
  
      // Devolver una respuesta exitosa
      res.status(200).json({ message: 'Company profile updated successfully' });
    } catch (error) {
      console.error('Error updating company profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.get("/companies", async (req, res) => {
    const companies = await Company.findAll()
    res.status(200).json({
        ok: true,
        status: 200,
        body: companies
    })
});
router.post("/company/login", async (req, res) => {
    const { company_email, company_password } = req.body;

    try {
        const company = await Company.findOne({
            where: {
                company_email,
                company_status: true 


            }
        });

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const match = await bcrypt.compare(company_password, company.company_password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const companyData = {
            company_email: company.company_email,
            isCompany: true
        };

        const token = jwt.sign({ companyData }, process.env.SECRET_KEY , { expiresIn: '72h' });
        
        res.status(200).json({
            ok: true,
            status: 200,
            body: {
                company: companyData,
                token
            }
        });
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const saltRounds = 10;

router.post("/companies", async (req, res) => {
    const companyData = req.body;

    const hashedPassword = await bcrypt.hash(companyData.company_password, saltRounds);

    try {
        const updatedCompany = await Company.create({
            company_nif: companyData.company_nif,
            company_email: companyData.company_email,
            company_name: companyData.company_name,
            company_password: hashedPassword, 
            company_info: companyData.company_info,
        });
        console.log(companyData)
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Created Company"
        });
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post("/check-club", async (req, res) => {
    const { company_email, company_nif } = req.body;
    try {
        const company = await Company.findOne({
            where: { company_email: company_email }
        });
        
        if (!company) {
            res.status(200).json({ exists: false });
            return;
        }

        if (company.company_nif === company_nif) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking club:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put("/companies/toggle-state", async (req, res) => {
    const company_nif = req.body.company_nif;

    try {
        const company = await Company.findByPk(company_nif);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        company.company_status = !company.company_status;

        await company.save();

        res.status(200).json({ message: 'Company status toggled successfully', company_status: company.company_status });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while toggling company status' });
    }
});

router.get("/company/profile", async (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded)
    const companyData = decoded.companyData;
    console.log(companyData.company_email)
    const company = await Company.findOne({
        where: {
          company_email: companyData.company_email
        }
      });
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      console.log(company)
      console.log('++++++++++++++++++++++++++++++++++++++++'+company.company_nif)

      res.status(200).json({
        ok: true,
        status: 200,
        body: company
      });
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

module.exports = router;