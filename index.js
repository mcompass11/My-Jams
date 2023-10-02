const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path'),
      bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));

const { check, validationResult } = require('express-validator');

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'https://heroku.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      //if a specific origin isn't found on the list
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
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
app.get('/albums', passport.authenticate('jwt', { session: false }),async (req, res) => {
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
app.get('/albums/:title', passport.authenticate('jwt', {session: false }),(req, res) => {
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
app.get('/artist/:name', passport.authenticate('jwt', {session: false }),(req, res) => {
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
  app.post('/users', [
    //validation logic
    check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],async (req, res) => {
    //check validation objects for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }).then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
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
  app.get('/users/:Username', passport.authenticate('jwt', {session: false }),async (req, res) => {
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
  app.put('/users/:Username', passport.authenticate('jwt', {session: false }), [
  //validation logic
  check('Username', 'Username is required').isLength({min:5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
],async (req, res) => {
    //checks to be sure username matches
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }

    //check validation objects for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

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
  app.post('/users/:Username/albums/:AlbumID', passport.authenticate('jwt', {session: false }),async (req, res) => {
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
  app.delete('/users/:Username', passport.authenticate('jwt', {session: false }),async (req, res) => {
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
  app.delete('/users/:Username/albums/:AlbumID', passport.authenticate('jwt', {session: false }),async (req, res) => {
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

//listen for local requests
// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });

//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});