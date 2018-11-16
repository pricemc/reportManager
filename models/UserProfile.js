const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserProfileSchema = new Schema({
  email: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Worker', 'Super', 'Admin'],
    default: 'Worker'
  }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
