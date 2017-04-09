var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var database = require('diskdb');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

database.connect('./database/', ['articles', 'tags', 'users', 'currconfig', 'accounts']);

app.get('/articles', function (req, res) {
    res.send(database.articles.find());
});

app.get('/tags', function (req, res) {
    res.send(database.tags.find());
});

app.get('/users', function (req, res) {
    res.send(database.users.find());
});

app.get('/currconfig', function (req, res) {
    res.send(database.currconfig.find());
});

app.get('/accounts', function (req, res) {
    res.send(database.accounts.find());
});

app.post('/articles', function (req, res) {
    database.articles.remove();
    database.loadCollections(['articles']);
    database.articles.save(req.body);
    res.json(req.body);
});

app.post('/tags', function (req, res) {
    database.tags.remove();
    database.loadCollections(['tags']);
    database.tags.save(req.body);
    res.json(req.body);
})

app.post('/users', function (req, res) {
    database.users.remove();
    database.loadCollections(['users']);
    database.users.save(req.body);
    res.json(req.body);
})

app.post('/currconfig', function (req, res) {
    database.currconfig.remove();
    database.loadCollections(['currconfig']);
    database.currconfig.save(req.body);
    res.json(req.body);
});

app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.listen(3000, function () {
    console.log('Succesfully started server at localhost:3000');
});
