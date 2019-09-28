console.log("main js loaded");
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.textAlign = "center";
var todo = `TODO\n1. PDF 공유`;
ctx.fillText(todo, canvas.width / 2, canvas.height / 2);
