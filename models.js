const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

let albumSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Artist: {
    Name: String,
    City: String,
    Birthyear: Date,
    Discography: [String],
    Image: String 
  },
  Genre: String,
  Year: Date,
  Trackslist: [String],
  Image: String
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let Album = mongoose.model('Album', albumSchema);
let User = mongoose.model('User', userSchema);

module.exports.Album = Album;
module.exports.User = User;