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

app.post("/github/initLocalRepo", async (req, res) => {
  // hardcoded remote
  const remote = "https://github.com/chenIsai/amazingidea.git";

  // pass to local server through socket
  io.emit("initRepo", remote);
  res.send({ message: "local repo initialized" });
});
