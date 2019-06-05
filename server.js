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

app.get("/scrape", function(req, res) {
    var found;
    var titleArr = [];
      db.Article.find({})
        .then(function(dbArticle) {
          for (var j=0; j<dbArticle.length;j++) {
            titleArr.push(dbArticle[j].title)
          }
          console.log(titleArr);
      request("https://universe.byu.edu/", function(error, response, html) {
      if (!error && response.statusCode == 200) {
          // console.log(html);
        }
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html, {
        xml: {
          normalizeWhitespace: true,
        }
      })
      $("body h3").each(function(i, element) {
        // Save an empty result object
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element).children("a").text();
        found = titleArr.includes(result.title);
        result.link = $(element).children("a").attr("href");
        result.excerpt = $(element).parent().children(".td-excerpt").text().trim();
        if (!found && result.title && result.link){
          results.push(result);
       }
      });
        res.render("scrape", {
        articles: results
      });
    })
  });
  });

// app.get("/scrape", function (req, res) {
//     axios.get("http://www.echojs.com/").then(function (response) {
//         var $ = cheerio.load(response.data);

//         $("article h3").each(function (i, element) {
//             var result = {};

//             result.title = $(this)
//                 .children("a")
//                 .text();
//             result.link = $(this)
//                 .children("a")
//                 .attr("href");

//             db.Article
//                 .create(result)
//                 .then(function (dbArticle) {
//                     res.send("Scrape Complete");
//                 })
//                 .catch(function (err) {
//                     res.json(err)
//                 });
//         });
//     });
// });

app.get("/articles", function (req, res) {

});

app.get("/articles/:id", function (req, res) {

});

app.post("/articles/:id", function (req, res) {

});




app.listen(PORT, function () {
    console.log("App is running on port " + PORT + "!");
});