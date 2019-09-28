const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

app.listen(3000, () => {
  console.log("Start! express server on port 3000");
});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});

app.post("/export_pdf", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});
