require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const urlParser = require('url');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


const DB = require('./UrlDB').DB;

app.get('/api/shorturl/:requestedURL', (req, res) => {
  try {
    let requestedURL = DB.getURL(req.params.requestedURL);
    requestedURL ? res.redirect(requestedURL) : res.json({error : 'key does not exists'});
  } catch {
    res.json({error : 'Keys must be integers'})
  }
});

const isValidURL = (urlString) => {
  try {
    new urlParser.URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
}

app.post('/api/shorturl/:requestedUrl?', (req, res) => {
  let url = urlParser.parse(req.body.url);
  try {

    // Check if the URL is valid
    if(!isValidURL(url.href)) throw 'invalid url';

    // If DNS lookup fails it means the hostname is not valid
    dns.lookup(url.host, (err) => {
      if (err) {
        console.log(err);
        throw 'invalid url';
      } else {
        const key = DB.addURL(url.href);
        res.json({ original_url: url.href, short_url: key });
      }
    });
  } catch (err) {
    res.json({ error: err });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
