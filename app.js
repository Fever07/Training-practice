const express = require('express');

const app = express();

const path = require('path');

const bodyParser = require('body-parser');

const database = require('diskdb');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

database.connect('./database/', ['articlesMap', 'authorIndex', 'tagsIndex', 'articles', 'tags', 'users', 'currconfig', 'accounts']);

app.get('/articlesMap', (req, res) => {
    res.send(database.articlesMap.find());
});

app.get('/authorIndex', (req, res) => {
    res.send(database.authorIndex.find());
});

app.get('/tagsIndex', (req, res) => {
    res.send(database.tagsIndex.find());
});

app.get('/articles', (req, res) => {
    res.send(database.articles.find());
});

app.get('/tags', (req, res) => {
    res.send(database.tags.find());
});

app.get('/users', (req, res) => {
    res.send(database.users.find());
});

app.get('/currconfig', (req, res) => {
    res.send(database.currconfig.find());
});

app.get('/accounts', (req, res) => {
    res.send(database.accounts.find());
});

app.post('/articlesMap', (req, res) => {
    database.articlesMap.remove();
    database.loadCollections(['articlesMap']);
    database.articlesMap.save(req.body);
    res.json(req.body);
});

app.post('/authorIndex', (req, res) => {
    database.authorIndex.remove();
    database.loadCollections(['authorIndex']);
    database.authorIndex.save(req.body);
    res.json(req.body);
});

app.post('/tagsIndex', (req, res) => {
    database.tagsIndex.remove();
    database.loadCollections(['tagsIndex']);
    database.tagsIndex.save(req.body);
    res.json(req.body);
});

app.post('/articles', (req, res) => {
    database.articles.remove();
    database.loadCollections(['articles']);
    database.articles.save(req.body);
    res.json(req.body);
});

app.post('/tags', (req, res) => {
    database.tags.remove();
    database.loadCollections(['tags']);
    database.tags.save(req.body);
    res.json(req.body);
});

app.post('/users', (req, res) => {
    database.users.remove();
    database.loadCollections(['users']);
    database.users.save(req.body);
    res.json(req.body);
});

app.post('/currconfig', (req, res) => {
    database.currconfig.remove();
    database.loadCollections(['currconfig']);
    database.currconfig.save(req.body);
    res.json(req.body);
});

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.listen(3000, () => {
    console.log('Succesfully started server at localhost:3000');
});
