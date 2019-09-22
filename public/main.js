console.log("main js loaded");
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.textAlign = "center";
ctx.fillText("Hello World", canvas.width / 2, canvas.height / 2);
