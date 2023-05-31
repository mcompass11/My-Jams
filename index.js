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
    artist: 'Bas',
    genre: 'Hip-Hop',
    year: '2018',
    trackslist: ['Icarus', 'Front Desk', 'Tribe', 'Boca Raton', 'Barack Obama Special',
                'Purge', 'Fragrance', 'Infinity', 'Infinity+2', 'Sanufa', 'Great Ones',
                'PDA', 'Designer', 'Spaceships + Rockets'],
    image: '',
  },
  {
    title: 'Out The Trunk',
    artist: 'Larry June',
    genre: 'Hip-Hop',
    year: '2019',
    trackslist: ['From Uncle Herm', 'Let\'s Drive To Vegas', 'Smoothies In 1991',
                'Organic Fatherhood', 'SLS 30 Days', 'Mission Bay', '2002 S500 Benz',
                'Mason Cafe', 'Organic Smiles', 'I Told You In 07'],
    image: '',
  },
  {
    title: 'The Port of San Francisco',
    artist: 'Larry June',
    genre: 'Hip-Hop',
    year: '2019',
    trackslist: ['Cold Summer', 'Always Want More', 'Dear, John', 'Thug for It', 'Diamond Heights',
                'Lets Get Smoothies', 'Discipline', '1987 Vette', 'Orangic Dreams'],
    image: '',
  },
  {
    title: 'Product of the Dope Game',
    artist: 'Larry June',
    genre: 'Hip-Hop',
    year: '2019',
    trackslist: ['Calculated Risk (Intro)', 'Recaro Seats', 'Adjust to the Game',
                'Around the World', 'Peanut Butter Ragtop', 'Uncle Larry', 'Organic Secrets',
                'The Working Girl', 'Gotta Step It Up', 'Consistent', 'Numbers Don\'t Lie',
                'Something Gotta Change', 'Organic Tears', 'Spilled Orange Juice'],
    image: '',
  },
  {
    title: 'The Great Escape',
    artist: 'Larry June',
    genre: 'Hip-Hop',
    year: '2023',
    trackslist: ['Turkish Cotton', '89 Earthquake', 'Solid Plan', 'Palisades, CA',
                'Summer Reign', 'Orange Village', 'Porches in Spanish', 'Art Talk',
                'Ocean Sounds', 'Left No Evidence', 'What Happened To The World?',
                'Éxito', '60 Days', 'Barragán Lighting', 'Margie\'s Candy House'],
    image: '',
  },
  {
    title: 'Macadelic',
    artist: 'Mac Miller',
    genre: 'Hip-Hop',
    year: '2012',
    trackslist: ['Love Me As I Have Loved You', 'Desperado', 'Loud', 'Thoughts From A Balcony',
                'Aliens Fighting Robots', 'Vitamins', 'Fight The Feeling', 'Lucky Ass Bitch',
                'The Mourning After', '1 Threw 8', 'Ignorant', 'The Question', 'Angels(When She Shuts Her Eyes)',
                'Sunlight', 'Clarity', 'America', 'Fuck \'Em All'],
    image: '',
  },
  {
    title: 'GO:OD AM',
    artist: 'Mac Miller',
    genre: 'Hip-Hop',
    year: '2015',
    trackslist: ['Doors', 'Brand Name', 'Rush Hour', 'Two Matches', '100 Grandkids',
                'Time Flies', 'Weekend', 'Clubhouse', 'In the Bag', 'Break the Law',
                'Perfect Circle/God Speed', 'When In Rome', 'ROS', 'Cut the Check',
                'Ascension', 'Jump', 'The Festival'],
    image: '',
  },
  {
    title: 'The Devine Feminine',
    artist: 'Mac Miller',
    genre: 'Hip-Hop',
    year: '2016',
    trackslist: ['Congratulations', 'Dang!', 'Stay', 'Skin', 'Cinderella', 'Planet God Damn',
                'Soulmate', 'We', 'My Favorite Part', 'God Is Fair, Sexy Nasty'],
    image: '',
  },
  {
    title: 'The Resurrection',
    artist: 'Bugzy Malone',
    genre: 'Hip-Hop',
    year: '2021',
    trackslist: ['The Resurrection', 'M.E.N III', 'Don\'t Cry', 'Cold Nights In The 61',
                'Welcome To The Hood', 'The Masters (Interlude)', 'Van Gogh Effect',
                'Salvador', 'Ride Out', 'Bounce', 'Notorious', 'The Immortals (Interlude)',
                'Gods', 'Angels', 'Skeletons'],
    image: '',
  },
  {
    title: 'Based On A Feeling',
    artist: 'Sabrina Claudio',
    genre: 'Pop',
    year: '2022',
    trackslist: ['Subtle Things', 'Don\' Make Me Wait', 'IOU', 'Impersonator', 'Sunset Eyes',
                'Better Version', 'Put On Repeat', 'Basic Needs', 'Favorite Part',
                'Still Strangers', 'Protect Her'],
    image: '',
  },
  {
    title: 'Ctrl',
    artist: 'SZA',
    genre: 'R&B',
    year: '2017',
    trackslist: ['Supermodel', 'Love Galore', 'Doves In The Wind', 'Drew Barrymore', 'Prom',
                'The Weekend', 'Go Gina', 'Garden(Say It Like Dat)', 'Broken Clocks',
                'Anything', 'Wavy(Interlude)', 'Normal Girl', 'Pretty Little Birds', '20 Something'],
    image: '',
  },
  {
    title: 'Oblivion',
    artist: 'T-Pain',
    genre: 'Hip-Hop',
    year: '2017',
    trackslist: ['Who Died', 'Classic You', 'Straight', 'That\'s How It Go', 'No Rush',
                'Pu$$y On The Phone', 'Textin\' My Ex', 'May I', 'I Told My Girl',
                'She Needed Me', 'Your Friend', 'Cee Cee From DC', 'Goal Line', '2 Fine',
                'That Comeback', 'Second Chance'],
    image: '',
  },
  {
    title: 'Flower Boy',
    artist: 'Tyler, The Creator',
    genre: 'Hip-Hop',
    year: '2017',
    trackslist: ['Foreword', 'Where This Flower Blooms', 'Sometimes...', 'See You Again',
                'Who Dat Boy', 'Pothole', 'Garden Shed', 'Boredom', 'I Ain\'t Got Time',
                '911/Mr. Lonely', 'Droppin\' Seeds', 'November', 'Glitter', 'Enjoy Right Now, Today'],
    image: '',
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