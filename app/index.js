const express = require("express");
const testRouter = require("./routes/test")
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use('/api/test', testRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
