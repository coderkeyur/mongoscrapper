var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var db = require("./models");

var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

var results = [];
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/week18Populater", {
    useMongoClient: true
});


app.get("/", function (req, res) {
    res.render("index");
});

app.get("/scrape", function (req, res) {
    var found;
    var titleArr = [];
    db.Article.find({})
        .then(function (dbArticle) {
            for (var j = 0; j < dbArticle.length; j++) {
                titleArr.push(dbArticle[j].title)
            }
            console.log(titleArr);
            request("https://universe.byu.edu/", function (error, response, html) {
                if (!error && response.statusCode == 200) {
                }
                var $ = cheerio.load(html, {
                    xml: {
                        normalizeWhitespace: true,
                    }
                })
                $("body h3").each(function (i, element) {
                    
                    var result = {};
                    result.title = $(element).children("a").text();
                    found = titleArr.includes(result.title);
                    result.link = $(element).children("a").attr("href");
                    result.excerpt = $(element).parent().children(".td-excerpt").text().trim();
                    if (!found && result.title && result.link) {
                        results.push(result);
                    }
                });
                res.render("scrape", {
                    articles: results
                });
            })
        });
});

app.get("/saved", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {
            console.log(dbArticle);
            res.render("saved", {
                saved: dbArticle
            });
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.post("/api/saved", function (req, res) {
    db.Article.create(req.body)
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {

});

app.post("/articles/:id", function (req, res) {

});

app.get("/articles/:id", function (req, res) {
    console.log(req.params.id);
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            console.log(dbArticle);
            if (dbArticle) {
                res.render("articles", {
                    data: dbArticle
                });
            }
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.delete("/saved/:id", function (req, res) {
    db.Article.deleteOne({ _id: req.params.id })
        .then(function (removed) {
            res.json(removed);
        }).catch(function (err, removed) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App is running on port " + PORT + "!");
});