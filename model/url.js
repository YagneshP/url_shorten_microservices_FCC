const mongoose = require('mongoose');


const urlSchema = new mongoose.Schema({
	longUrl: {type:String},
	shortUrl: {type:Number}
})

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;