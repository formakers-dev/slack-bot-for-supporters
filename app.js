const express = require('express');
const logger = require('morgan');

const rtmController = require('./controller/rtm');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', rtmController.listen);

module.exports = app;
