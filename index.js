const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv');

const routes = require('./routes/index.js');

const server = express();

// add other middleware
server.use(cors());
server.use(morgan('dev'));

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
server.use(bodyParser.json());

server.use('/', routes);

const config = {
  port: process.env.PORT || 4000,
};

server.use(express.static('public'));

server.listen(config.port, () => {
  console.log('Express server listening on port', config.port);
});

module.exports = server;
