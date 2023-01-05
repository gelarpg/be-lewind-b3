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
// view engine setup
const pathViews = 'views';
app.set('views', path.join(__dirname, pathViews));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'TIPIDKOR%20CORP^#$5sX(Hf6KUo!#65^',
  name: 'TIPIDKOR%20CORP',
  resave: false,
  saveUninitialized: true,
  httpOnly: true,
  secure: true,
  ephemeral: true,
  rolling: true,
  cookie: {
    // maxAge: 1000 * 60 * 60 * 24, // 24 hour
    maxAge: 99999999,
    // expires: new Date(Date.now() + (1000 * 60 * 60 * 1)).getTime(),
    httpOnly: true
  }
}));

app.use(express.static(path.join(__dirname, '../public')));

// configure routes
app.use('/', indexRouter);

// error handler
app.use(function (err, req, res, next) {
  // render error csrf
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
