const express = require("express");
const models = require("../models/cockroach");
const router = express.Router();

// Initialize user info
router.post("/init", (req, res) => {
  const { prompt, email, token } = req.body;

  // store info in db
  res.send("test");
});

// Send verification pin
router.get("/code", (req, res) => {
  const { prompt } = req.body;
  // check prompt against db

  // send email
  res.send("test");
});

// Verify pin
router.post("/verify", (req, res) => {
  const { pin } = req.body;
  res.send("test");
});
module.exports = router;
