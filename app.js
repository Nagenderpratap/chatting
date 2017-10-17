var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var server = http.createServer(app);
var chat = require('./routes/chat');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/agicent-chat', {useMongoClient: true });
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/chat', chat);

server.listen(8080, function () {
    console.log('Express server listening on %d', 8080);
    
});



module.exports = app;