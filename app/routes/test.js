const express = require("express");
const router = express.Router();

//router.use(verifyToken);
router.get("/", (req, res) => {
  res.send("test");
});

module.exports = router;
