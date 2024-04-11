const express = require('express')
const app  = express()
const router= require("../router/client.router")
const morgan= require("morgan")

app.use(morgan("dev"))

app.get("/", (req,res)=>{
    res.send("This is Raulin")
});
app.use(express.json())
app.use("/api", router)

module.exports = app;
