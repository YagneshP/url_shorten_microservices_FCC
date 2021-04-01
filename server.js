require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const Url = require("./model/url");
const dns = require("dns");
// Basic Configuration
const port = process.env.PORT || 3000;
// let counter = 0;
app.use(cors());
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

//connect to mongodb
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));
//Home route
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// GET route for the shorturl
app.get("/api/shorturl/:id", async (req, res) => {
  try {
    let foundUrl = await Url.findOne({ shortUrl: +req.params.id });
    if (foundUrl) {
      res.redirect(foundUrl.longUrl);
    } else {
      throw Error;
    }
  } catch (err) {
    res.json({ error: "invalid url" });
  }
});

//POST route for new shortURL

app.post("/api/shorturl/new", async (req, res) => {
  try {
    const httpRegex = /^https?:\/\//gi;
    const domainRegex = /^([a-z0-9]+\.)?[a-z0-9][a-z0-9-]*\.([a-z]{2,}\.?)+/gm;
    let url = "" + req.body.url;
    if (httpRegex.test(url)) {
      let trimmedUrl = url.replace(httpRegex, "");
      let domainUrl = trimmedUrl.match(domainRegex); //will match the domain url
      if (domainUrl) {
        //check the domain url is verified domain or not
        dns.lookup(domainUrl[0], async (err, address, family) => {
          if (err) {
            //if err/ not valid url/ not getting domain  then send json with error message
            res.json({ error: "Invalid URL" });
          } else {
            //  find in db if url exist or not
            let foundUrl = await Url.findOne({ longUrl: url }).exec();
            //if yes then return url
            if (foundUrl) {
              res.json({
                original_url: foundUrl.longUrl,
                short_url: foundUrl.shortUrl,
              });
            } else {
              let counter = Math.round(Math.random() * 1000000); // can use hash to improve assign the shorturl
              //if no create the short url withh counter
              let newUrl = await Url.create({
                longUrl: url,
                shortUrl: counter,
              });
              await newUrl.save();
              res.json({
                original_url: newUrl.longUrl,
                short_url: newUrl.shortUrl,
              });
            }
          }
        });
      } else {
        throw new Error();
      }
    } else {
      throw new Error();
    }
  } catch (err) {
    res.json({ error: "Invalid URL" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
