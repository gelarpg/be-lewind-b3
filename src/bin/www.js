#!/usr/bin/env node

/**
 * Module dependencies.
 */
import { createConnection } from "typeorm";
import "regenerator-runtime/runtime.js";

import app from '../app';
import http from 'http';
import https from 'https';

const debug = require('debug')('lms:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var options = {
  // key: fs.readFileSync('/etc/ssl/api-bitode.key'),
  // cert: fs.readFileSync('/etc/ssl/api-bitode.lpkbitode-so.com.crt'),
  // ca: fs.readFileSync('/etc/ssl/api-bitode.lpkbitode-so.com_chain.crt')
};

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] == 'http') {
    return res.redirect(301, 'https://' + req.headers.host + '/');
  } else {
    return next();
  }
});

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

// Create HTTPS server
https.createServer(options, app).listen(4433);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  createConnection().then(connection => {
    if (connection) {
      const addr = server.address();
      const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
      console.log('Succesfully connect DB and listening on ' + bind);
    } else {
      console.log("Can't connect to DB");
    }
  }).catch((err) => {
    console.log(err)
  })
}