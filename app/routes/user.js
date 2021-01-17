const express = require("express");
const models = require("../models/cockroach");
const router = express.Router();

// Initialize user info
router.post("/init", async (req, res) => {
  const { prompt, email, token } = req.body;
  try {
    // check if prompt exists
    const existing = model.User.findAll({
      where: {
        prompt: prompt,
      },
    });
    console.log("existing", existing);

    if (!existing) {
      // store info in db
      const user = await models.User.create({ prompt, email, gh_token: token });
      console.log("new user: ", user);
      res.send(user);
    } else {
      // user already exists
      res.sendStatus(400);
    }
  } catch (e) {
    console.error("error initializing, ", e);
    res.sendStatus(401);
  }
});

const generatePin = () => {
  // generate random 5 digit num
  return Math.floor(10000 + Math.random() * 90000);
};

// Send verification pin
router.get("/code", async (req, res) => {
  const { prompt } = req.body;

  // check prompt against db
  try {
    const email = await models.User.findAll({
      where: {
        prompt: prompt,
      },
      attributes: ["email"],
    });
    console.log("user found with email: ", email);

    // generate pin
    const pin = generatePin();

    // TODO: end email

    // update table
    await models.User.update(
      {
        pin: pin,
      },
      {
        where: {
          prompt: prompt,
        },
      }
    );
    console.log("pin generated and table updated");
    res.sendStatus(200);
  } catch (e) {
    console.error("error on /code", e);
    res.sendStatus(401);
  }
});

// Verify pin
router.post("/verify", (req, res) => {
  const { pin } = req.body;

  try {
    // find if pin exists
    const existing = models.User.findAll({
      where: {
        pin: pin,
      },
    });

    if (existing) {
      // TODO: authenticate using github token
      console.log(existing);
    } else {
      // invalid pin
      res.sendStatus(400);
    }
  } catch (e) {
    console.error("error trying to verify pin", e);
    res.sendStatus(401);
  }
});
module.exports = router;
