const express = require('express');
const app = express();
const router = require("../router/client.router");
const morgan = require("morgan");
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is Raulin");
});

app.use("/api", router);

module.exports = app;
