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
app.set("view engine", "ejs");

app.listen(port, () => {
  console.log("Start! express server on port 3000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});

app.get("/result", (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});

app.post("/result", (req, res) => {
  console.log(req.body);
  res.render("result.ejs", {
    answer1: req.body.answer1,
    answer2: req.body.answer2,
    answer3: req.body.answer3,
    answer4: req.body.answer4,
    answer5: req.body.answer5,
    answer6: req.body.answer6,
    answer7: req.body.answer7,
    answer8: req.body.answer8,
    answer9: req.body.answer9,
    answer10: req.body.answer10,
    answer11: req.body.answer11,
    answer12: req.body.answer12
  });
});
