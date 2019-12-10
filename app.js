const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const rtmController = require('./controller/rtm');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/rtm', rtmController.listen);

app.use('/', indexRouter);

module.exports = app;
