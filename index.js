const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path');
      
const app = express();

//create a write stream in append mode
// a log.txt file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),
    {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

let myAlbums = [
  {
    title: 'Black Album',
    author: 'Jay-Z'
  },
  {
    title: 'Out the Trunk',
    author: 'Larry June'
  },
  {
    title: 'The Port of San Francisco',
    author: 'Larry June'
  },
  {
    title: 'Product of the Dope Game',
    author: 'Larry June'
  },
  {
    title: 'Macadelic',
    author: 'Mac Miller'
  },
  {
    title: 'GO:OD AM',
    author: 'Mac Miller'
  },
  {
    title: 'The Devine Feminine',
    author: 'Mac Miller'
  },
  {
    title: 'The Resurrection',
    author: 'Bugzy Malone'
  },
  {
    title: 'Based On A Feeling',
    author: 'Sabrina Claudio'
  },
  {
    title: 'Ctrl',
    author: 'SZA'
  },
  {
    title: 'Oblivion',
    author: 'T-Pain'
  },
  {
    title: 'Flower Boy',
    author: 'Tyler, The Creator'
  },
];

//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my music library!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/albums', (req, res) => {
  res.json(myAlbums);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});