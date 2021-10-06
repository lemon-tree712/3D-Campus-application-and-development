var http = require("http");
var express = require("express");
const path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, '')));

app.listen(4111, () => {
  console.log(`App listening at port 4111`)
})