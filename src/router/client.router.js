const router = require("express").Router();
const jwt = require('jsonwebtoken');
const { faker } = require("@faker-js/faker")
const Clients = require("../model/client.model")
router.get("/clients", async (req, res) => {
    const clients = await Clients.findAll()
    console.log(clients)
    res.status(200).json({
        ok: true,
        status: 200,
        body: clients
    })
})
router.get("/clients/profile", async (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded)
    const clientData = decoded.clientData;
    console.log(clientData.client_email)
    const client = await Clients.findOne({
        where: {
          client_email: clientData.client_email
        }
      });
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      console.log(client)
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

        const clientData = {
            client_email: client.client_email
        };

        const token = jwt.sign({ clientData }, process.env.SECRET_KEY , { expiresIn: '72h' });
        
        res.status(200).json({
            ok: true,
            status: 200,
            body: {
                client: clientData,
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

router.put("/clients/edit", async (req, res) => {
    const id = req.params.client_id;
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