var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require ("request");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

app.get("/", function(req, res) {
    res.render("index");
});


app.listen(PORT, function() {
    console.log("App is running on port " + PORT + "!");
});