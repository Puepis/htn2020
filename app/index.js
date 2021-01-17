const express = require("express");
const testRouter = require("./routes/test");
const githubRouter = require("./routes/github");
const userRouter = require("./routes/user");
const models = require("./models/cockroach");
const app = express();
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

const PORT = process.env.PORT || 8000;
// Automatically create tables for the Sequelize models then start the server
models.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });
  })
  .error((e) => console.error("error connecting to db: ", e));
