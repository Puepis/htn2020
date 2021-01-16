const express = require("express");
const testRouter = require("./routes/test")
const githubRouter = require("./routes/github")
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use('/test', testRouter);
app.use('/github', githubRouter);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
