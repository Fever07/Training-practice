articlesBaseService = (function () {

    var articlesMap = {
        data: {},
        //size: 0,
        insert: function (id, article) {
            articlesMap.data[id] = article;
            //articlesMap.size++;
            article.tags.forEach(function (tag) {
                if (tagsIndex[tag]) {
                    tagsIndex[tag].push(id);
                    tagsIndex[tag].sort();
                } else {
                    tagsIndex[tag] = [];
                    tagsIndex[tag].push(id);
                }
            });
            if (authorIndex[article.author]) {
                authorIndex[article.author].push(id);
                authorIndex[article.author].sort();
            } else {
                authorIndex[article.author] = [];
                authorIndex[article.author].push(id);
            }
        },
        remove: function (id) {
            if (articlesMap.data[id]) {
                articlesMap.data[id].tags.forEach(function (tag) {
                    const arrTag = tagsIndex[tag];
                    arrTag.splice(arrTag.indexOf(id), 1);
                    if (arrTag.length == 0)
                        delete tagsIndex[tag];
                });
                const arrAuthor = authorIndex[articlesMap.data[id].author];
                arrAuthor.splice(arrAuthor.indexOf(id), 1);
                if (arrAuthor.length == 0)
                    delete authorIndex[articlesMap.data[id].author];
                delete articlesMap.data[id];
                //articlesMap.size--;
            }
        },
        get: function (id) {
            return articlesMap.data[id];
        }
    }

    function getArticlesNumber() {
        return Object.keys(articlesMap.data).length;
    }

    var tagsIndex = {};
    var authorIndex = {};

    function validateMap() {

        /*for (var art in articlesMap.data) {
            var k = articlesMap.data[art];
            articlesMap.remove(k.id);
            articlesMap.insert(k.id, k);
            setToDatabase();
        }*/

        for (var art in articlesMap.data) {
            const dat = articlesMap.data[art];
            dat.tags.forEach(function (tag) {
                if (tagsIndex[tag].indexOf(dat.id) != -1)
                    console.log("TRUE FOR: " + tag + " IN:" + dat.id);
                else
                    console.log("FALSE FOR: " + tag + " IN:" + dat.id);
            })
            if (authorIndex[dat.author].indexOf(dat.id) != -1)
                console.log("TRUE FOR: " + dat.author + " IN:" + dat.id);
            else
                console.log("FALSE FOR: " + dat.author + " IN:" + dat.id);
        }
    }

    function getMap() {
        return {
            t: tagsIndex,
            a: authorIndex,
            m: articlesMap
        }
    }

    function getAllAuthors() {
        return Object.keys(authorIndex);
    }
    
    function getAllTags() {
        return Object.keys(tagsIndex);
    }

    (function getFromDatabase() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/articlesMap', false);
        xhr.send();
        if (xhr.status == 200) {
            const data = JSON.parse(xhr.responseText, function (key, value) {
                if (key != '_id') {
                    if (key == 'createdAt') return new Date(value);
                    return value;
                }
            })[0];
            for (var id in data) {
                if (id != '_id') {
                    articlesMap.insert(id, data[id]);
                }
            }
        }
    }());

    function setToDatabase() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/articlesMap', false);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(articlesMap.data));
    }
    
    function _mapaddArticle(article) {
        if (validateArticle(article)) {
            articlesMap.insert(article.id, article);
            setToDatabase();
            return true;
        } else
            return false;
    }
    
    function _mapeditArticle(article, articleChanged) {
        if (articleChanged.title && articleChanged.summary && articleChanged.content && articleChanged.tags) {
            articlesMap.remove(article.id);
            article.title = articleChanged.title;
            article.summary = articleChanged.summary;
            article.content = articleChanged.content;
            article.tags = articleChanged.tags;
            return _mapaddArticle(article);
        }
    }

    function _mapgetArticle(id) {
        return articlesMap.get(id);
    }

    function _mapremoveArticle(id) {
        articlesMap.remove(id);
        setToDatabase();
    }

    function _mapgetByIds(ids) {
        var ret = [];
        ids.forEach(function (id) {
            ret.push(articlesMap.get(id));
        })
        return ret;
    }

    function _mapgetArticles(skip, top, filter) {
        var articles = _mapgetByIds(Object.keys(articlesMap.data));
        var filteredArticles = articles.filter(function (article) {
            var ans = true;
            if (filter) {
                if (filter.author && filter.author != article.author)
                    ans = false;
                if (filter.dateFrom && article.createdAt < filter.dateFrom)
                    ans = false;
                if (filter.dateTo && article.createdAt >= filter.dateTo)
                    ans = false;
                if (filter.tags != null)
                    filter.tags.forEach(
                        function (item, i, arr) {
                            var currtag = item;
                            var currans = false;
                            article.tags.forEach(
                                function (item, i, arr) {
                                    if (item === currtag)
                                        currans = true;
                                }
                            );
                            if (currans == false)
                                ans = false;
                        }
                    )
            }
            return ans;
        });
        filteredArticles.sort(compareDate);
        return filteredArticles.slice(skip, top);
    }

    function validateArticle(article) {
        return (article.id && article.title && article.summary && article.content && article.author && article.tags);
    }

    function compareDate(a, b) {
        if (a.createdAt > b.createdAt)
            return -1;
        else
            return 1;
    }

    function createID(param) {
        var ret = '';
        ret += articlesBaseService.getArticlesNumber();
        ret += param;
        return ret;
    }

    function createEmptyArticle(param) {
        return {
            id: '' + createID(param),
            title: '',
            summary: '',
            createdAt: new Date(),
            author: '',
            content: '',
            tags: ['']
        };
    }

    return {
        createEmptyArticle: createEmptyArticle,
        getMap: getMap,
        validateMap: validateMap,
        getAllAuthors: getAllAuthors,
        getAllTags: getAllTags,
        _mapgetArticles: _mapgetArticles,
        _mapgetArticle: _mapgetArticle,
        _mapaddArticle: _mapaddArticle,
        _mapeditArticle: _mapeditArticle,
        _mapremoveArticle: _mapremoveArticle,
        _mapgetByIds: _mapgetByIds,
        getArticlesNumber: getArticlesNumber,
        createID: createID
    }

}());
