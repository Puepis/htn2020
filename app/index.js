const express = require("express");
const testRouter = require("./routes/test");
const githubRouter = require("./routes/github");
const userRouter = require("./routes/user");
const models = require("./models/cockroach");
const app = express();
const socketIO = require("socket.io");

const cors = require("cors");

const corsConfig = {
  origin: "*",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

app.use(cors(corsConfig));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/test", testRouter);
app.use("/github", githubRouter);
app.use("/user", userRouter);

var io;
const PORT = process.env.PORT || 8000;
// Automatically create tables for the Sequelize models then start the server
models.sequelize
  .sync()
  .then(() => {
    var server = app.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });

    io = socketIO(server);

    io.on("connection", (socket) => {
      theSocket = socket;
      console.log("Client connected");
      socket.on("disconnect", () => console.log("Client disconnected"));
    });
  })
  .error((e) => console.error("error connecting to db: ", e));

app.post("/createRepo", async (req, res) => {
  const { prompt, name } = req.query;

  // check if authenticated
  const existing = await models.User.findAll({
    where: {
      prompt: prompt,
    },
    attributes: ["authenticated", "gh_token"],
  });
  const { gh_token: token, authenticated } = existing[0].dataValues;

  if (authenticated) {
    // fetch token
    const octokit = generateOcto(token);

    // create github repo
    try {
      const createRes = await octokit.repos.createForAuthenticatedUser({
        name,
      });
      console.log(createRes);

      // hardcoded remote
      const remote = "https://github.com/chenIsai/amazingidea.git";

      // pass to local server through socket
      io.emit("initRepo", remote);
      res.send(createRes);
    } catch (e) {
      console.error("Create repo error: ", e);
      res.sendStatus(401);
    }
  } else {
    console.error("user is not authorized");
    res.sendStatus(401);
  }
});

