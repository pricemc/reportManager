var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var logger = require('./config/logger');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/mevn-secure', { useNewUrlParser: true, promiseLibrary: require('bluebird') })
  .then(() => logger.info('MongoDB Connection Successful.'))
  .catch((err) => {
    logger.error(err);
  });
mongoose.set('useCreateIndex', true);


var api = require('./routes/index.js');

app.use(logger.expressLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use('/api', api);
app.use(express.static(path.join(__dirname, 'src')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// restful api error handler
app.use(function (err, req, res, next) {

  if (req.app.get('env') !== 'development') {
    delete err.stack;
  }

  res.status(err.status || 500).json(err);
});

require('child_process').exec('git rev-parse --short HEAD', function (err, stdout) {
  git_rev = stdout;
  logger.log('Last commit hash on this branch is: ', stdout);
});

require('child_process').exec('git log -1 --format=%cd --date=local', function (err, stdout) {
  git_time = stdout;
  logger.log('Last commit on this branch was: ', stdout);
});

var path = require('path');
var appDir = path.dirname(require.main.filename);
var git_rev;
var git_time;
var appRootFolder = function (dir, level) {
  var arr = dir.split('\\');
  arr.splice(arr.length - level, level);
  var rootFolder = arr.join('\\');
  return rootFolder;
}

module.exports = app;
