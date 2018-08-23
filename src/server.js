// TODO
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const mongoose = require('mongoose');
const routes = require('./routes');

// Setup db
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri);
mongoose.connection.on('error', console.error.bind(console, 'mongo connection error:'));

const app = express();
app.use(bodyParser.json());

app.use('/', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  console.log(err);
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 409);
  console.log(err);
  res.send(err.message);
});



module.exports = app;
