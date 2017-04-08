var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var database = require('diskdb');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.listen(3000, function () {
    console.log('Succesfully started server at localhost:3000');
});
