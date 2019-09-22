const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Start! express server on port 3000");
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});
