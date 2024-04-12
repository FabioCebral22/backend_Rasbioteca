const router = require("express").Router();
const jwt = require('jsonwebtoken');
const { faker } = require("@faker-js/faker")
const Clients = require("../model/client.model")
router.get("/clients", async (req, res) => {
    const clients = await Clients.findAll()
    res.status(200).json({
        ok: true,
        status: 200,
        body: clients
    })
})
router.get("/clients/:client_id", async (req, res) => {
    const id = req.params.client_id; // Usar el nombre correcto del parámetro
    try {
        const client = await Clients.findOne({
            where: {
                client_id: id,
            }
        });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({
            ok: true,
            status: 200,
            body: client
        });
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post("/clients/login", async (req, res) => {
    const { client_email, client_password } = req.body;

    try {
        const client = await Clients.findOne({
            where: {
                client_email,
                client_password
            }
        });

        if (!client) {
            return res.status(404).json({ error: 'Client not found or invalid credentials' });
        }

        const token = jwt.sign({ clientId: client.id }, 'secretKey', { expiresIn: '72h' });
        
        res.status(200).json({
            ok: true,
            status: 200,
            body: {
                client,
                token
            }
        });
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





router.post("/clients", async (req, res) => {
    const dataClients = req.body
    await Clients.sync()
    const updatedClient = await Clients.create({
        client_nickname: dataClients.client_nickname   ,
        client_email: dataClients.client_email,
        client_password: dataClients.client_password,
        client_name: dataClients.client_name,

    })
    res.status(201).json({
        ok: true,
        status: 201,
        message: "Created Client"
    })
})
router.put("/clients/:product_id", async (req, res) => {
    const id = req.params.product_id;
    const dataClients=req.body;
    const updateClient = await Clients.update({
        client_nickname: dataClients.client_nickname   ,
        client_email: dataClients.client_email,
        client_password: dataClients.client_password,
        client_name: dataClients.client_name,
    },
    {
        where: {
            client_id:id,
        }
    }
    );
    res.status(200).json({
        ok: true,
        status: 200,
        body: updateClient,
        message: "Updated Client"
    })
})
router.delete("/clients", (req, res) => {
    res.send("I am a router")
})

module.exports = router;