const express = require('express');
const app = express();
const clientRouter = require("../router/client.router");
const companyRouter = require("../router/company.router");
const morgan = require("morgan");
const cors = require('cors');
require('dotenv').config();

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is Raulin");
});

app.use("/api", clientRouter);
app.use("/api", companyRouter);

module.exports = app;
