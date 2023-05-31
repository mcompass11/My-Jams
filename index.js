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
    title: 'Milky Way',
    artist: {
      name: 'Bas',
      city: 'Queens, New York',
      born: 'May 27, 1987',
      albums: ['Last Winter', 'Too High to Riot', 'Milky Way'],
      image: 'https://i.discogs.com/mFijoRMcFrHAgeGLUNCYVoYK_payGrTBu6uIb7DQMyQ/rs:fit/g:sm/q:90/h:900/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTQ4Mjg5/MTktMTU5NzYyMjg1/NS0yNDkyLmpwZWc.jpeg'
    },
    genre: 'Hip-Hop',
    year: '2018',
    trackslist: ['Icarus', 'Front Desk', 'Tribe', 'Boca Raton', 'Barack Obama Special',
                'Purge', 'Fragrance', 'Infinity', 'Infinity+2', 'Sanufa', 'Great Ones',
                'PDA', 'Designer', 'Spaceships + Rockets'],
    image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.com%2FMilky-Way-Bas%2Fdp%2FB07HSM5C7K&psig=AOvVaw1RmpZgwn85UwCrFIj5m0LY&ust=1685642555424000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCLD6noCSoP8CFQAAAAAdAAAAABAE',
  },
  {
    title: 'The Stoned Immaculate',
    artist: {
      name: 'Curren$y',
      city: 'New Orleans, Louisiana',
      born: 'April 4, 1981',
      albums: ['This Ain\'t No Mixtape', 'Jet Files', 'Pilot Talk', 'Pilot Talk II',
              'Weekend at Burnie\'s', 'The Stoned Immaculate', 'Pilot Talk III',
              'Canal Street Confidential', 'Back at Burnie\'s', 'Collection Agency',
              'Still Stoned on Ocean', 'Pilot Talk IV'],
      image: 'https://creativeloafing.com/dl63099?display&x=990&y=808'

    },
    genre: 'Hip-Hop',
    year: '2012',
    trackslist: ['What It Look Like', 'Privacy Glass', 'Armoire', 'Take You There', 'Showroom',
                'Capitol', 'No Squares', 'Sunroof', 'Chasin\' Papers', 'That\'s The Thing','Chandelier',
                'Fast Cars Faster Women', 'Jet Life', 'Audio Dope 3', 'One More Time', 'J.L.R'],
    image: 'https://media.pitchfork.com/photos/5929b5a3b1335d7bf169a923/1:1/w_600/fd63d2c6.jpeg'
  },
  {
    title: 'Pilot Talk III',
    artist: {
      name: 'Curren$y',
      city: 'New Orleans, Louisiana',
      born: 'April 4, 1981',
      albums: ['This Ain\'t No Mixtape', 'Jet Files', 'Pilot Talk', 'Pilot Talk II',
              'Weekend at Burnie\'s', 'The Stoned Immaculate', 'Pilot Talk III',
              'Canal Street Confidential', 'Back at Burnie\'s', 'Collection Agency',
              'Still Stoned on Ocean', 'Pilot Talk IV'],
      image: 'https://creativeloafing.com/dl63099?display&x=990&y=808'

    },
    genre: 'Hip-Hop',
    year: '2015',
    trackslist: ['Opening Credits', 'Long as The Lord Say', 'Cargo Planes', 'Froze', 'Get Down',
                'Sidewalk Show', 'The 560 SL', 'Audio Dope 5', 'Life I Chose', 'Pot Jar',
                'Search Party', 'All I Know', 'Briefcase', 'Lemonade Mimosas', 'Alert'],
    image: 'https://i1.sndcdn.com/artworks-000114327639-robtmx-t500x500.jpg'
  },
  {
    title: 'Out The Trunk',
    artist: {
      name: 'Larry June',
      city: 'San Francisco, California',
      born: 'April 8, 1991',
      albums: ['Cali Grown', 'Cali Grown 2', 'Very Peaceful', 'Early Bird',
              'The Port of San Francisco', 'Out the Trunk', 'Product of the Dope Game',
              'Adjust to the Game', 'Orange Print', 'Spaceships on the Blade'],
      image: 'https://image.mymixtapez.com/artists/5869/profile/medium'
    },
    genre: 'Hip-Hop',
    year: '2019',
    trackslist: ['From Uncle Herm', 'Let\'s Drive To Vegas', 'Smoothies In 1991',
                'Organic Fatherhood', 'SLS 30 Days', 'Mission Bay', '2002 S500 Benz',
                'Mason Cafe', 'Organic Smiles', 'I Told You In 07'],
    image: 'https://i.scdn.co/image/ab67616d0000b27327e41ce6f9954c4f833bcde2',
  },
  {
    title: 'The Port of San Francisco',
    artist: {
      name: 'Larry June',
      city: 'San Francisco, California',
      born: 'April 8, 1991',
      albums: ['Cali Grown', 'Cali Grown 2', 'Very Peaceful', 'Early Bird',
              'The Port of San Francisco', 'Out the Trunk', 'Product of the Dope Game',
              'Adjust to the Game', 'Orange Print', 'Spaceships on the Blade'],
      image: 'https://image.mymixtapez.com/artists/5869/profile/medium'
    },
    genre: 'Hip-Hop',
    year: '2019',
    trackslist: ['Cold Summer', 'Always Want More', 'Dear, John', 'Thug for It', 'Diamond Heights',
                'Lets Get Smoothies', 'Discipline', '1987 Vette', 'Orangic Dreams'],
    image: 'https://i.scdn.co/image/ab67616d0000b27336b47a92296a8ae2581cb626',
  },
  {
    title: 'Product of the Dope Game',
    artist: {
      name: 'Larry June',
      city: 'San Francisco, California',
      born: 'April 8, 1991',
      albums: ['Cali Grown', 'Cali Grown 2', 'Very Peaceful', 'Early Bird',
              'The Port of San Francisco', 'Out the Trunk', 'Product of the Dope Game',
              'Adjust to the Game', 'Orange Print', 'Spaceships on the Blade'],
      image: 'https://image.mymixtapez.com/artists/5869/profile/medium'
    },
    genre: 'Hip-Hop',
    year: '2019',
    trackslist: ['Calculated Risk (Intro)', 'Recaro Seats', 'Adjust to the Game',
                'Around the World', 'Peanut Butter Ragtop', 'Uncle Larry', 'Organic Secrets',
                'The Working Girl', 'Gotta Step It Up', 'Consistent', 'Numbers Don\'t Lie',
                'Something Gotta Change', 'Organic Tears', 'Spilled Orange Juice'],
    image: 'https://images.genius.com/9b4596f645cc2a8e2ecfd09908f8522a.939x939x1.jpg',
  },
  {
    title: 'The Great Escape',
    artist: {
      name: 'Larry June',
      city: 'San Francisco, California',
      born: 'April 8, 1991',
      albums: ['Cali Grown', 'Cali Grown 2', 'Very Peaceful', 'Early Bird',
              'The Port of San Francisco', 'Out the Trunk', 'Product of the Dope Game',
              'Adjust to the Game', 'Orange Print', 'Spaceships on the Blade'],
      image: 'https://image.mymixtapez.com/artists/5869/profile/medium'
    },
    genre: 'Hip-Hop',
    year: '2023',
    trackslist: ['Turkish Cotton', '89 Earthquake', 'Solid Plan', 'Palisades, CA',
                'Summer Reign', 'Orange Village', 'Porches in Spanish', 'Art Talk',
                'Ocean Sounds', 'Left No Evidence', 'What Happened To The World?',
                'Éxito', '60 Days', 'Barragán Lighting', 'Margie\'s Candy House'],
    image: 'https://media.pitchfork.com/photos/642612ff2c20ad244264783c/1:1/w_600/Larry-June-The-Alchemist-The-Great-Escape.jpg',
  },
  {
    title: 'Macadelic',
    artist: {
      name: 'Mac Miller',
      city: 'Pittsburgh, Pennsylvania',
      born: 'January 19, 1992',
      albums: ['Blue Slide Park', 'Watching Movies with the Sound Off', 'GO:OD AM',
              'The Devine Feminine', 'Swimming', 'Circles'],
      image: 'https://media.gq.com/photos/56015a50c5022b3211500a02/1:1/w_1632,h_1632,c_limit/mac-miller-portrait.jpg'
    },
    genre: 'Hip-Hop',
    year: '2012',
    trackslist: ['Love Me As I Have Loved You', 'Desperado', 'Loud', 'Thoughts From A Balcony',
                'Aliens Fighting Robots', 'Vitamins', 'Fight The Feeling', 'Lucky Ass Bitch',
                'The Mourning After', '1 Threw 8', 'Ignorant', 'The Question', 'Angels(When She Shuts Her Eyes)',
                'Sunlight', 'Clarity', 'America', 'Fuck \'Em All'],
    image: 'https://upload.wikimedia.org/wikipedia/en/e/e8/Macadelic_mixtape_cover.jpg',
  },
  {
    title: 'GO:OD AM',
    artist: {
      name: 'Mac Miller',
      city: 'Pittsburgh, Pennsylvania',
      born: 'January 19, 1992',
      albums: ['Blue Slide Park', 'Watching Movies with the Sound Off', 'GO:OD AM',
              'The Devine Feminine', 'Swimming', 'Circles'],
      image: 'https://media.gq.com/photos/56015a50c5022b3211500a02/1:1/w_1632,h_1632,c_limit/mac-miller-portrait.jpg'
    },
    genre: 'Hip-Hop',
    year: '2015',
    trackslist: ['Doors', 'Brand Name', 'Rush Hour', 'Two Matches', '100 Grandkids',
                'Time Flies', 'Weekend', 'Clubhouse', 'In the Bag', 'Break the Law',
                'Perfect Circle/God Speed', 'When In Rome', 'ROS', 'Cut the Check',
                'Ascension', 'Jump', 'The Festival'],
    image: 'https://media.npr.org/assets/img/2015/09/09/goodam_front-rgb_sq-adab53447161d6ad22e52c179a17d06295ec844f-s1100-c50.jpg',
  },
  {
    title: 'The Devine Feminine',
    artist: {
      name: 'Mac Miller',
      city: 'Pittsburgh, Pennsylvania',
      born: 'January 19, 1992',
      albums: ['Blue Slide Park', 'Watching Movies with the Sound Off', 'GO:OD AM',
              'The Devine Feminine', 'Swimming', 'Circles'],
      image: 'https://media.gq.com/photos/56015a50c5022b3211500a02/1:1/w_1632,h_1632,c_limit/mac-miller-portrait.jpg'
    },
    genre: 'Hip-Hop',
    year: '2016',
    trackslist: ['Congratulations', 'Dang!', 'Stay', 'Skin', 'Cinderella', 'Planet God Damn',
                'Soulmate', 'We', 'My Favorite Part', 'God Is Fair, Sexy Nasty'],
    image: 'https://upload.wikimedia.org/wikipedia/en/9/93/Mac_Miller_-_The_Divine_Feminine.png',
  },
  {
    title: 'The Resurrection',
    artist: {
      name: 'Bugzy Malone',
      city: 'Machester, United Kingdom',
      born: 'December 20, 1990',
      albums: ['B. Inspired', 'The Resurrection'],
      image: 'https://i.guim.co.uk/img/media/a3cb411a252e01bfb530103ce726287b09300324/0_0_4428_6271/master/4428.jpg?width=445&quality=85&dpr=1&s=none'
    },
    genre: 'Hip-Hop',
    year: '2021',
    trackslist: ['The Resurrection', 'M.E.N III', 'Don\'t Cry', 'Cold Nights In The 61',
                'Welcome To The Hood', 'The Masters (Interlude)', 'Van Gogh Effect',
                'Salvador', 'Ride Out', 'Bounce', 'Notorious', 'The Immortals (Interlude)',
                'Gods', 'Angels', 'Skeletons'],
    image: 'https://i.scdn.co/image/ab67616d0000b2738684528fb16ca965c1101572',
  },
  {
    title: 'Based On A Feeling',
    artist: {
      name: 'Sabrina Claudio',
      city: 'Miami, Florida',
      born: 'September 19, 1996',
      albums: ['No Rain, No Flowers', 'Truth Is', 'Christmas Blues', 'Based on a Feeling'],
      image: 'https://dujour.com/wp-content/uploads/a/a15259e4d6cf.jpg'
    },
    genre: 'Pop',
    year: '2022',
    trackslist: ['Subtle Things', 'Don\' Make Me Wait', 'IOU', 'Impersonator', 'Sunset Eyes',
                'Better Version', 'Put On Repeat', 'Basic Needs', 'Favorite Part',
                'Still Strangers', 'Protect Her'],
    image: 'https://i.scdn.co/image/ab67616d0000b273be4cac8d1aab9f1ec2506a76',
  },
  {
    title: 'Ctrl',
    artist: {
      name: 'SZA',
      city: 'St. Louis, Missouri',
      born: 'November 8, 1989',
      albums: ['Ctrl', 'SOS'],
      image: 'https://www.billboard.com/wp-content/uploads/media/sza-afropunk-billboard-1548.jpg'
    },
    genre: 'R&B',
    year: '2017',
    trackslist: ['Supermodel', 'Love Galore', 'Doves In The Wind', 'Drew Barrymore', 'Prom',
                'The Weekend', 'Go Gina', 'Garden(Say It Like Dat)', 'Broken Clocks',
                'Anything', 'Wavy(Interlude)', 'Normal Girl', 'Pretty Little Birds', '20 Something'],
    image: 'https://i.scdn.co/image/ab67616d0000b2731882add8fd275c04e322027d',
  },
  {
    title: 'Oblivion',
    artist: {
      name: 'T-Pain',
      city: 'Tallahassee, Florida',
      born: 'September 30, 1984',
      albums: ['Rappa Ternt Sanga', 'Epiphany', 'Three Ringz', 'Revolver', 'Oblivion', '1UP',
              'On Top of the Covers'],
      image: 'https://i.discogs.com/JSMj1x7GwiNNqavghDjekGsx2Xhn_fL78V49GAIFpUY/rs:fit/g:sm/q:90/h:764/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTM4Mjkz/NC0xNTg4MDc1NTY1/LTkyNDUuanBlZw.jpeg'
    },
    genre: 'Hip-Hop',
    year: '2017',
    trackslist: ['Who Died', 'Classic You', 'Straight', 'That\'s How It Go', 'No Rush',
                'Pu$$y On The Phone', 'Textin\' My Ex', 'May I', 'I Told My Girl',
                'She Needed Me', 'Your Friend', 'Cee Cee From DC', 'Goal Line', '2 Fine',
                'That Comeback', 'Second Chance'],
    image: 'https://upload.wikimedia.org/wikipedia/en/b/bd/TPizzleOblivion.jpg',
  },
  {
    title: 'Flower Boy',
    artist: {
      name: 'Tyler, The Creator',
      city: 'Hawthorne, California',
      born: 'March 6, 1991',
      albums: ['Goblin', 'Wolf', 'Cherry Bomb', 'Flower Boy', 'Igor', 'Call Me If You Get Lost'],
      image: 'https://media.pitchfork.com/photos/61edb62a6c322b7123e6a098/1:1/w_1000,h_1000,c_limit/Tyler,%20the%20Creator.jpg'
    },
    genre: 'Hip-Hop',
    year: '2017',
    trackslist: ['Foreword', 'Where This Flower Blooms', 'Sometimes...', 'See You Again',
                'Who Dat Boy', 'Pothole', 'Garden Shed', 'Boredom', 'I Ain\'t Got Time',
                '911/Mr. Lonely', 'Droppin\' Seeds', 'November', 'Glitter', 'Enjoy Right Now, Today'],
    image: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Tyler%2C_the_Creator_-_Flower_Boy.png',
  },
];

//GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my music library!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

//returns albums to user
app.get('/albums', (req, res) => {
  res.json(myAlbums);
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
    const { city, born, image } = artistAlbums[0].artist;
    artist.city = city;
    artist.born = born;
    artist.image = image;
    artist.albums = artistAlbums.map(album => album.name);
  }

  //Return the artist object to the user
  res.json(artist);
  });


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});