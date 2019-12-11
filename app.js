const express = require('express');
const logger = require('morgan');
const http = require('http');
const port = require('./config').port;
const db = require('./db');
db.init();

const rtmController = require('./controller/rtm');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', rtmController.listen);

http.createServer(app).listen(port, () => {
    console.log('Express App on http port ' + port);
});

module.exports = app;
