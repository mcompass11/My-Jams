const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path'),
      bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));

const Models = require('./models');

const Albums = Models.Album;
const Users = Models.User;

//create a write stream in append mode
// a log.txt file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),
    {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/myJamsDB', { useNewUrlParser: true, useUnifiedTopology: true });


//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my music library!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

//returns albums to user
app.get('/albums', async (req, res) => {
  await Albums.find()
    .then((albums) => {
      res.status(201).json(albums);
})
.catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
});
});

//returns data of single album to user
app.get('/albums/:title', (req, res) => {
  console.log("Requested title:", req.params.title);

  Albums.findOne({ Title: req.params.title })
  .then((album) => {
    res.json(album);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//return genre info

//returns data about artist to user
app.get('/artist/:name', (req, res) => {
  //Retrieves albums with artist name matching request parameter
  Albums.find({ 'Artist.Name': req.params.name })
    .then(artistAlbums => {
      if (artistAlbums && artistAlbums.length) {
        //Create an object with artist info
        const artist = {
          Name: req.params.name
        };

        //Set artist properties from the first album
        const { City, Birthyear, Image } = artistAlbums[0].Artist;
        artist.City = City;
        artist.Birthyear = Birthyear;
        artist.Image = Image;
        artist.Discography = artistAlbums.map(album => album.Title);

        //Return the artist object to the user
        res.json(artist);
      } else {
        res.status(404).send('Artist not found');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  //Creates a user
  app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username }).then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }).then((user) => {res.status(201).json(user)}).catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    }).catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
  });

  //Retrieves user by username
  app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  //Ability to update user info
  app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }) //This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  });

  //Add an album to a user favorites
  app.post('/users/:Username/albums/:AlbumID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $push: { FavoriteAlbums: req.params.AlbumID }
    },
    { new: true }) //This makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  //Delete a user
  app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  //Remove an album from user favorites
  app.delete('/users/:Username/albums/:AlbumID', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username }, {
      $delete: { FavoriteAlbums: req.params.AlbumID }
    },
    {new: true }) //This makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});