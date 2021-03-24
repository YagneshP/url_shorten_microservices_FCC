require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// GET route for the shorturl
app.get('/api/shorturl/id',(req, res) =>{
  res.json({ greeting: 'hello changed to shorturl this will redirect to original url' });
});

//POST route for new shortURL

app.post('api/shorturl/new', (req,res)=>{
	console.log("Hello from the POST route")
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
