const router = require("express").Router();
const jwt = require('jsonwebtoken');
const { faker } = require("@faker-js/faker")
const Clients = require("../model/client.model");
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/'));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


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
                client_state: true 
            }
        });

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        
        const match = await bcrypt.compare(client_password, client.client_password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
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

const saltRounds = 10;

router.post("/clients", async (req, res) => {
    const dataClients = req.body;

    const hashedPassword = await bcrypt.hash(dataClients.client_password, saltRounds);

    await Clients.sync();
    const updatedClient = await Clients.create({
        client_nickname: dataClients.client_nickname,
        client_email: dataClients.client_email,
        client_password: hashedPassword, 
        client_name: dataClients.client_name,
        client_img: "/public/1715705340991-default.jpg",
    });

    res.status(201).json({
        ok: true,
        status: 201,
        message: "Created Client"
    });
});

router.put("/clients/edit/:clientId", upload.single('client_img'), async (req, res) => {
    const clientId = req.params.clientId;
  
    try {
        const client = await Clients.findByPk(clientId);
    
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
    
        const hashedPassword = await bcrypt.hash(req.body.client_password, saltRounds);

        client.client_nickname = req.body.client_nickname;
        client.client_password = hashedPassword;
    
        if (req.file) {
            client.client_img = '/public/' + req.file.filename; 
        }
    
        await client.save();
        res.status(200).json({ message: 'Client profile updated successfully' });
    } catch (error) {
        console.error('Error updating client profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete("/clients/:id", async (req, res) => {
    try {
        const client = await Clients.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        await client.destroy();

        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the client' });
    }
});

router.get('/clients/all', async (req, res) => {
    try {
        const clients = await Clients.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching clients' });
    }
});

router.put("/clients/toggle-state", async (req, res) => {
    const clientId = req.body;
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++" + clientId.client_id)

    try {
        const client = await Clients.findByPk(clientId.client_id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        client.client_state = !client.client_state; 

        await client.save();

        res.status(200).json({ message: 'Client state toggled successfully', client_state: client.client_state });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while toggling client state' });
    }
});


router.delete("/clients", (req, res) => {
    res.send("I am a router")
})

module.exports = router;