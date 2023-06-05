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

const mongoose = require('mongoose');
const Models = require('./models');

const Albums = Models.Album;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myJamsDB', { useNewUrlParser: true, useUnifiedTopology: true });

//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my music library!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

//returns albums to user
app.get('/albums', (req, res) => {
  Albums.find().then(albums => res.json(albums));
});

//returns data of single album to user
app.get('/albums/:title', (req, res) => {
  res.json(myAlbums.find( (album) => 
    { return album.title === req.params.title}));
});

//returns data about artist to user
app.get('/artist/:name', (req, res) => {
  //Filter albums to find albums with artist name matching request parameter
  const artistAlbums = myAlbums.filter(album => album.artist.name === req.params.name);

  //Create an object with artist info
  const artist = {
    name: req.params.name
  };

  //If artist has an album, set artist properties from album
  if (artistAlbums.length) {
    const { city, birthYear, image } = artistAlbums[0].artist;
    artist.city = city;
    artist.birthYear = birthYear;
    artist.image = image;
    artist.albums = artistAlbums.map(album => album.name);
  }

  //Return the artist object to the user
  res.json(artist);
  });

  app.get('/users', (req, res) => {

  })


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});