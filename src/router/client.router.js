const router = require("express").Router();
const { faker, da } = require("@faker-js/faker")
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


router.post("/clients", async (req, res) => {
    const dataProducts = req.body
    await Clients.sync()
    const createProduct = await Clients.create({
        client_nickname: dataProducts.client_nickname   ,
        client_email: dataProducts.client_email,
        client_password: dataProducts.client_password,
        client_name: dataProducts.client_name,

    })
    res.status(201).json({
        ok: true,
        status: 201,
        message: "Created Client"
    })
})
router.put("/clients", (req, res) => {
    res.send("I am a router")
})
router.delete("/clients", (req, res) => {
    res.send("I am a router")
})

module.exports = router;