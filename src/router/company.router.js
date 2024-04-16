const { faker } = require("@faker-js/faker")
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const Company = require("../model/company.model");

module.exports = router;