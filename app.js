const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const path = require("path");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("Start! express server on port 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});

app.post("/export_pdf", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});
