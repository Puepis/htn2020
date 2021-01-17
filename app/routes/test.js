const express = require("express");
const models = require("../models/cockroach");
const router = express.Router();

router.get("/", (req, res) => {

  res.send("test");
});

module.exports = router;
