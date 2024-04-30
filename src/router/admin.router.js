const express = require('express');
const router = express.Router();
const Client = require('../model/client.model');
const Company = require('../model/company.model');
const Club = require('../model/club.model');
const jwt = require("jsonwebtoken");
const Admin = require('../model/admin.model');
const bcrypt = require('bcrypt');

router.post('/admin/login', async (req, res) => {
    const { admin_name, admin_password } = req.body;

    if (!admin_name || !admin_password) {
        return res.status(400).json({ error: 'Admin name and password are required' });
    }

    try {
        const admin = await Admin.findOne({
            where: {
                admin_name
            }
        });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const validPassword = await bcrypt.compare(admin_password, admin.admin_password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const adminData = {
            admin_name: admin.admin_name
        };

        const token = jwt.sign({ adminData }, process.env.SECRET_KEY , { expiresIn: '72h' });

        res.status(200).json({
            ok: true,
            status: 200,
            body: {
                admin: adminData,
                token,
                message: 'Admin logged in successfully'
            }
        });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/admin/register', async (req, res) => {
    const { admin_name, admin_password, admin_email } = req.body;

    if (!admin_name || !admin_password || !admin_email) {
        return res.status(400).json({ error: 'Admin name, password and email are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(admin_password, 10);

        const admin = await Admin.create({
            admin_name,
            admin_password: hashedPassword,
            admin_email
        });

        res.status(201).json({
            ok: true,
            status: 201,
            body: {
                admin,
                message: 'Admin registered successfully'
            }
        });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;