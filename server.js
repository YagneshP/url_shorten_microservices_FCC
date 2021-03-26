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
app.use(express.urlencoded());
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
    //hostname only accept 'company'+'.com/.org...'
    const httpRegex = /^https?:\/\//gi;
    // const domainRegex = /^([a-z0-9]+\.)?[a-z0-9][a-z0-9-]*\.[a-z]{2,6}$/ig;
    let url = "" + req.body.url;
    if (httpRegex.test(url)) {
      url = url.replace(httpRegex, "");
    }

    if (url) {
      //check the new url is verified domain or not
      dns.lookup(url, async (err, address, family) => {
        if (err) {
          //if err/ not valid url/ not getting domain  then send json with error message
          res.json({ error: "Invalid url" });
        } else {
          url = "https://" + url;
          //  find in db if url exist or not
          let foundUrl = await Url.findOne({ longUrl: url }).exec();
          //if yes then return url
          if (foundUrl) {
            res.json({
              original_url: foundUrl.longUrl,
              short_url: foundUrl.shortUrl,
            });
          } else {
						let counter = Math.round(Math.random()*10000);
            //if no create the short url withh counter
            let newUrl = await Url.create({ longUrl: url, shortUrl: counter });
            counter++; //increment the counter;
            await newUrl.save();
            res.json({
              original_url: newUrl.longUrl,
              short_url: newUrl.shortUrl,
            });
          }
        }
      });
    }
  } catch (err) {
    res.json({ error: "Invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
