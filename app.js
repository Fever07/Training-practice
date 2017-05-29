const express = require('express');

const app = express();

const path = require('path');

const bodyParser = require('body-parser');

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

/*

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

*/

const mongoClient = require('mongodb').MongoClient;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

mongoClient.connect('mongodb://localhost:27017/test', (err, db) => {

    if (err) {
        console.log('MONGODB ERROR:');
        console.log(err);
    }

    const usersdb = db.collection('userstest');
    const articlesdb = db.collection('articles');
    const settings = db.collection('settings');
    const authorsList = db.collection('authorsList');
    const tagsList = db.collection('tagsList');

    passport.serializeUser((user, done) => {
        done(null, user._id);
	});

    passport.deserializeUser((id, done) => {
        usersdb.findById(id, (err, user) => {
            done(err, user);
        });
	});

    passport.use(new LocalStrategy({
            usernameField: 'login',
            passwordField: 'password',
        }, (username, password, done) => {
            usersdb.findOne({ login: username }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.',
                    });
                }
                if (user.password !== password) {
                    return done(null, false, {
                        message: 'Incorrect password.',
                    });
                }
                return done(null, user);
            });
        }));

    app.post('/login',
        passport.authenticate('local'), (req, res) => {
    	    res.send(req.user);
	    });

    app.post('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.post('/auth', (req, res, next) => {
        if (req.isAuthenticated())
            next()
        else
            res.redirect('/');
    });

    app.get('/tagsGet', (req, res) => {
        tagsList.find({}, (err, result) => {
            if (err)
                console.log(err);
            result.toArray().then((resultArray) => {
                res.send(resultArray);
            }, (error) => {
                console.log(error);
            });
        });
    });

    app.get('/authorsGet', (req, res) => {
        authorsList.find({}, (err, result) => {
            if (err)
                console.log(err);
            result.toArray().then((resultArray) => {
                res.send(resultArray);
            }, (error) => {
                console.log(error);
            });
        });
    });

    app.post('/authorsList', (req, res) => {
        authorsList.findOne({ 'author': req.body.author }).then(
            (result) => {
                let num;
                if (req.body.mod === 'add')
                    num = result.num + 1;
                else
                    num = result.num - 1;
                authorsList.updateOne({ 'author': result.author }, { $set: { 'num': num } });
            }, (err) => {
                console.log(err);
        });
    });

    app.post('/tagsList', (req, res) => {
        tagsList.findOne({ 'tag': req.body.tag }).then(
            (result) => {
                if (!result) {
                    if (req.body.mod === 'add')
                        tagsList.insertOne({
                            'tag': req.body.tag,
                            'num': 1,
                        });
                } else {
                    let num;
                    if (req.body.mod === 'add')
                        num = result.num + 1;
                    else
                        num = result.num - 1;
                    tagsList.updateOne({ 'tag': result.tag }, { $set: { 'num': num } });
                }
            }, (err) => {
                console.log(err);
            }
        )
    });

    app.get('/settingsId', (req, res) => {
        settings.findOne({ 'name': 'numberId' })
            .then((result) => {
                let num = result.value;
                res.send(JSON.stringify(num));
                num++;
                settings.updateOne({ 'name': 'numberId' }, { $set: { 'value': num } });
                }, (error) => {
                    console.log(error);
            });
    });

    app.post('/articlesGet', (req, res) => {
        const filter = req.body.filter;
        let arr = [];
        let num;
        const ret = [];
        let filterObject;
        if (!filter.author && !filter.tags)
            filterObject = { 'createdAt': { $gte: filter.dateFrom, $lte: filter.dateTo } };
        else if (filter.author && !filter.tags)
            filterObject = { 'createdAt': { $gte: filter.dateFrom, $lte: filter.dateTo }, 'author': filter.author };
        else if (!filter.author && filter.tags)
            filterObject = { 'createdAt': { $gte: filter.dateFrom, $lte: filter.dateTo }, 'tags': { $elemMatch: { $eq: filter.tags } } };
        else if (filter.author && filter.tags)
            filterObject = { 'createdAt': { $gte: filter.dateFrom, $lte: filter.dateTo }, 'author': filter.author, 'tags': { $elemMatch: { $eq: filter.tags } } };
        articlesdb.count(filterObject, (err, result) => {
            if (err)
                console.log(err);
            num = result;
            articlesdb.find(filterObject, (err, result) => {
                result.sort({ 'createdAt': -1 }).skip(req.body.skip).limit(req.body.top - req.body.skip);
                result.toArray().then((array) => {
                    arr = array;
                    ret.push(arr);
                    ret.push(num);
                    res.send(JSON.stringify(ret));
                }, (error) => {
                    console.log(error);
                });
            });
        });
    });

    app.post('/articlesEdit', (req, res) => {
        articlesdb.updateOne({ 'id': req.body.id }, { $set: {
            'title': req.body.toChange.title,
            'summary': req.body.toChange.summary,
            'content': req.body.toChange.content,
            'tags': req.body.toChange.tags,
        } }).then((result) => {
            res.send(JSON.stringify({ 'responseText': 'Edited succesfully!' }));
        }, (error) => {
            console.log(error);
            res.send(JSON.stringify({ 'responseText': 'Error! See console for more' }));
        });
    });

    app.post('/articlesGetById', (req, res) => {
        articlesdb.findOne({ 'id': req.body.id })
        .then((result) => {
            res.send(result);
        }, (error) => {
            console.log(error);
            res.send(JSON.stringify({ 'responseText': 'Error! See console for more' }));
        });
    });

    app.post('/articlesAdd', (req, res) => {
        settings.findOne({ 'name': 'numberId' })
            .then((result) => {
                let num = result.value;
                num++;
                settings.updateOne({ 'name': 'numberId' }, { $set: { 'value': num } });
                }, (error) => {
                    console.log(error);
            });
        articlesdb.insertOne(req.body.article)
        .then((result) => {
            res.send(JSON.stringify({ 'responseText': 'Edited succesfully!' }));
        }, (error) => {
            console.log(error);
            res.send(JSON.stringify({ 'responseText': 'Error! See console for more' }));
        });
    });

    app.post('/articlesRemove', (req, res) => {
        articlesdb.findOne({ 'id': req.body.id })
        .then((result) => {
            res.send(result);
            articlesdb.remove({ 'id': req.body.id }, true)
            .then(null, (error) => {
                console.log(error);
            });
        }, (error) => {
            console.log(error);
        });
    });

    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './public/index.html'));
    });

    app.listen(3000, () => {
        console.log('Succesfully started server at localhost:3000');
    });
});
