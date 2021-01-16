const express = require("express");
const testRouter = require("./routes/test")
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use('/api/test', testRouter);

const PORT = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`App started on port ${PORT}`);
});
