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

        if (!Company) {
            return res.status(404).json({ error: 'Company not found or invalid credentials' });
        }

        const companyData = {
            company_email: company.client_email
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
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/companies", async (req, res) => {
    const companyData = req.body
    await Company.sync()
    const updatedCompany = await Company.create({
        company_nif: companyData.company_nif,
        company_email: companyData.company_email,
        company_name: companyData.company_name,
        company_password: companyData.company_password,
        company_info: companyData.company_info,
    })
    res.status(201).json({
        ok: true,
        status: 201,
        message: "Created Company"
    })
})

module.exports = router;