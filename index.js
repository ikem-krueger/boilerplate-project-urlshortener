require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = []; // "data storage"

function validUrl(url) {
  const regex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

  return regex.test(url);
}

app.get('/api/shorturl/:short_url', function (req, res) {
  const index = req.params['short_url'];

  const url = urls[index - 1];

  if (url)
    res.redirect(url);
  else
    res.json({ error: 'invalid url' });
});

app.post('/api/shorturl', function (req, res) {
  const url = req.body.url;

  if (validUrl(url)) {
    const length = urls.length;

    const index = length + 1;

    urls[length] = url; // safe url to array

    res.json({ original_url: url, short_url: index });
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
