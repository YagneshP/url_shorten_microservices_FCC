require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); //Used to parse JSON bodies
app.use('/public', express.static(`${process.cwd()}/public`));

//connect to mongodb
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
				.catch(error => console.log("Error in connection with DB"));;

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// GET route for the shorturl
app.get('/api/shorturl/:id',(req, res) =>{
	//check the query :id and find the shorturl from DB
	//matching longurl and redirect user there
  res.json({ greeting: 'hello changed to shorturl this will redirect to original url' });
});

//POST route for new shortURL

app.post('/api/shorturl/new', (req,res)=>{
	//check the new url is verified domain or not
	// if yes then create the short url withh counter
	//if no then send json with error message
	res.json({originalUrl:"new", shortUrl:"saved url in DB"})
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
