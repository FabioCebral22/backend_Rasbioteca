const router = require("express").Router();
const { faker } = require("@faker-js/faker")
const Clients= require("../model/client.model")
router.get("/clients", async(req, res) => {
    const clients= await Clients.findAll()
    res.status(200).json({
            ok:true,
            status:200,
            body:clients
    })
})
// router.get("/clients", (req, res) => {
//     res.send("I am a router")
// })

router.post("/clients", async(req, res) => {
await Clients.sync()
const createProduct = await Clients.create({
    client_nickname:faker.internet.userName(),
    client_email:faker.internet.email() ,
    client_password:faker.internet.password(8) ,
    client_name:faker.person.fullName(),

})
res.status(201).json({
    ok:true,
    status:201,
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