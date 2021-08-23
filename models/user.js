const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  admin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
