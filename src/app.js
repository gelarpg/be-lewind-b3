require("reflect-metadata");
require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const csrf = require('csurf');
const session = require('express-session');
const cors = require('cors');
// CRON
// const scheduleFunction = require('./cron');
const indexRouter = require('./routes/index');

var app = express();
const config = process.env;

const whitelistDomain = [
  'http://localhost:3000',
  'http://103.107.100.20'
]
let corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelistDomain.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

// Init schedule
// scheduleFunction.initScheduledJobs();
app.use(cors(corsOptionsDelegate));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../public')));

// configure routes
app.use('/', indexRouter);

// error handler
app.use(function (err, req, res, next) {
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let statusCode = err.status || 500;
  let message = "Terjadi kesalahan pada server!";

  if (statusCode === 500) {
    console.log(err);
  } else {
    message = err.message;
  }

  res.status(statusCode);
  res.send({
    meta: {
      code: statusCode,
      success: false,
      message: message
    }
  });
});
module.exports = app;
