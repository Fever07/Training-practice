const express = require('express');

const app = express();

const path = require('path');

const bodyParser = require('body-parser');

const database = require('diskdb');

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    login: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
}));

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

        app.use(passport.initialize());
        app.use(passport.session());

database.connect('./database/', ['articlesMap', 'authorIndex', 'tagsIndex', 'currconfig', 'accounts']);

        passport.use(new LocalStrategy({
                usernameField: 'login',
                passwordField: 'password'
            }, (username, password, done) => {
                console.log(username, password, done);
                User.findOne({ username: username }, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            message: 'Incorrect username.'
                        });
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, {
                            message: 'Incorrect password.'
                        });
                    }
                    return done(null, user);
                });
            }
        ));

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log(err, user, info);
        console.log(req.body, res.body, next);
        if (err) {
            console.log(1);
            return next(err);
        }
        if (!user) {
            console.log(2);
            return next(null, false, {
                message: 'Incorrect username'
            });
        }
        req.logIn(user, function(err) {
            console.log(3);
            if (err) {
                console.log(4);
                return next(err);
            }
            console.log(5);
            return next(null, user);
        });
    })(req, res, next);
});

app.get('/articlesMap', (req, res) => {
    res.send(database.articlesMap.find());
});

app.get('/authorIndex', (req, res) => {
    res.send(database.authorIndex.find());
});

app.get('/tagsIndex', (req, res) => {
    res.send(database.tagsIndex.find());
});

app.get('/currconfig', (req, res) => {
    res.send(database.currconfig.find());
});

app.get('/accounts', (req, res) => {
    res.send(database.accounts.find());
});

app.post('/articlesMapGet', (req, res) => {
    const data = database.articlesMap.find()[0];
    const tagsIndex = database.tagsIndex.find()[0];
    const authorIndex = database.authorIndex.find()[0];
    const filter = req.body.filter;
    let usedFilter = 'none';
    let ids = [];
    if (filter.tags) {
        ids = tagsIndex[filter.tags];
        usedFilter = 'tags';
    } else if (filter.author) {
        ids = authorIndex[filter.author];
        usedFilter = 'author';
    } else
        for (let key in data)
            if (key != '_id')
                ids.push(key);
    let articles = [];
    ids.forEach((id) => {
        articles.push(data[id]);
    });
    if (usedFilter === 'author') {
        if (filter.tags) {
            articles = articles.filter((article) => {
                let ans = false;
                article.tags.forEach((tag) => {
                    if (tag === filter.tags)
                        ans = true;
                });
                return ans;
            });
        }
    } else if (usedFilter === 'tags') {
        if (filter.author) {
            articles = articles.filter((article) => {
                return article.author === filter.author;
            });
        }
    }
    if (filter.dateFrom)
        articles = articles.filter((article) => {
            return article.createdAt >= filter.dateFrom;
        });
    if (filter.dateTo)
        articles = articles.filter((article) => {
            return article.createdAt <= filter.dateTo;
        });
    articles.sort((a, b) => {
        if (a.createdAt > b.createdAt)
            return -1;
        return 1;
    });

    const ret = [];
    ret.push(articles.slice(req.body.skip, req.body.top));
    ret.push(articles.length);
    res.send(JSON.stringify(ret));
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
