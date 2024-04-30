const { faker } = require("@faker-js/faker")
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Company = require("../model/company.model");


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
                company_password
            }
        });

        if (!company) {
            return res.status(404).json({ error: 'Company not found or invalid credentials' });
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

router.post("/companies", async (req, res) => {
    const companyData = req.body;
    try {
        const updatedCompany = await Company.create({
            company_nif: companyData.company_nif,
            company_email: companyData.company_email,
            company_name: companyData.company_name,
            company_password: companyData.company_password,
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