const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Task management is running!");
});

app.listen(port, () => {
  console.log(`task management listening on port ${port}`);
});
