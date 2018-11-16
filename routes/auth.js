const passport = require('passport');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const settings = require('../config/settings');

const router = express.Router();
const User = require('../models/User');

router.post('/register', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, message: 'Please pass username and password.' });
  } else {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save((err) => {
      if (err) {
        return res.json({ success: false, message: 'Username already exists.' });
      }
      const token = jwt.sign(newUser.toJSON(), settings.tokenSecret, { expiresIn: settings.tokenLife });
      res.json({ success: true, message: 'Successful created new user.', token: `JWT ${token}` });
    });
  }
});

router.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.toJSON(), settings.tokenSecret, { expiresIn: settings.tokenLife });
          // return the information including token as JSON
          res.json({ success: true, token: `JWT ${token}` });
        } else {
          res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
});

module.exports = router;
