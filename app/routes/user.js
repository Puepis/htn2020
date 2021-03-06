const express = require("express");
const models = require("../models/cockroach");
const { sendVerificationEmail } = require("../util/email");
const router = express.Router();

// Initialize user info
router.post("/init", async (req, res) => {
  const { prompt, email, token } = req.body;
  try {
    // check if prompt exists
    const existing = await models.User.findAll({
      where: {
        prompt: prompt,
      },
    });
    console.log("existing length", existing.length);

    if (existing.length === 0) {
      // store info in db
      const user = await models.User.create({ prompt, email, gh_token: token });
      console.log("new user: ", user);
      res.send(user);
    } else {
      // user already exists
      console.log("user already exists");
      res.sendStatus(400);
    }
  } catch (e) {
    console.error("error initializing, ", e);
    res.sendStatus(401);
  }
});

router.post("/cleanup", async (req, res) => {
  const { prompt } = req.query;
  // set authenticated to false
  await models.User.update(
    {
      authenticated: false,
    },
    {
      where: {
        prompt: prompt,
      },
    }
  );
  res.json({ message: "cleaned up" });
});

const generatePin = () => {
  // generate random 5 digit num
  return Math.floor(10000 + Math.random() * 90000);
};

// Send verification pin
router.get("/code", async (req, res) => {
  const { prompt } = req.query;

  try {
    // check prompt against db
    const emailRes = await models.User.findAll({
      where: {
        prompt: prompt,
      },
      attributes: ["email"],
    });
    const { email } = emailRes[0].dataValues;
    console.log("user found with email: ", email);

    // generate pin
    const pin = generatePin();
    console.log("randomly generated pin: ", pin);

    // send email with pin
    const successful = await sendVerificationEmail(email, pin);
    console.log("email sent: ", successful);

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
    res.json({ message: "verification code sent" });
  } catch (e) {
    console.error("error on /code", e);
    res.sendStatus(401);
  }
});

// Verify pin
router.post("/verify", async (req, res) => {
  const { pin } = req.query;

  try {
    // find if pin exists
    const existing = await models.User.findAll({
      where: {
        pin: pin,
      },
    });

    if (existing.length > 0) {
      console.log("verification success: ", existing[0]);
      // reset pin
      await models.User.update(
        {
          pin: null,
          authenticated: true,
        },
        {
          where: {
            pin: pin,
          },
        }
      );
      res.send({ message: "verification success!" });
    } else {
      // invalid pin
      console.error("invalid pin");
      res.sendStatus(400);
    }
  } catch (e) {
    console.error("error trying to verify pin", e);
    res.sendStatus(401);
  }
});

module.exports = router;
