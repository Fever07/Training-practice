articlesBaseService = (function () {
    const articlesMap = {
        data: {},
        size: 0,
        insert: function (id, article) {
            articlesMap.data[id] = article;
            articlesMap.size++;
            article.tags.forEach((tag) => {
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
                articlesMap.data[id].tags.forEach((tag) => {
                    const arrTag = tagsIndex[tag];
                    arrTag.splice(arrTag.indexOf(id), 1);
                    if (arrTag.length === 0)
                        delete tagsIndex[tag];
                });
                const arrAuthor = authorIndex[articlesMap.data[id].author];
                arrAuthor.splice(arrAuthor.indexOf(id), 1);
                if (arrAuthor.length === 0)
                    delete authorIndex[articlesMap.data[id].author];
                delete articlesMap.data[id];
                articlesMap.size--;
            }
        },
        get: function (id) {
            return articlesMap.data[id];
        },
    };

    const tagsIndex = {};
    const authorIndex = {};

    function getArticlesNumber() {
        return articlesMap.size;
    }

    function getMap() {
        return {
            t: tagsIndex,
            a: authorIndex,
            m: articlesMap,
        };
    }

    function getAllAuthors() {
        const ret = Object.keys(authorIndex);
        ret.sort();
        return ret;
    }

    function getAllTags() {
        const ret = Object.keys(tagsIndex);
        ret.sort();
        return ret;
    }

    (function getFromDatabase() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/articlesMap', false);
        xhr.send();
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText, (key, value) => {
                if (key !== '_id') {
                    if (key === 'createdAt') return new Date(value);
                    return value;
                }
            })[0];
            for (let id in data) {
                if (id !== '_id') {
                    articlesMap.insert(id, data[id]);
                }
            }
        }
    }());

    function setToDatabase() {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/articlesMap', false);
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(articlesMap.data));
    }

    function validateArticle(article) {
        return (article.id && article.title && article.summary &&
        article.content && article.author && article.tags);
    }

    function addArticle(article) {
        if (validateArticle(article)) {
            articlesMap.insert(article.id, article);
            setToDatabase();
            return true;
        }
        return false;
    }

    function editArticle(article, articleChanged) {
        if (articleChanged.title && articleChanged.summary &&
            articleChanged.content && articleChanged.tags) {
            articlesMap.remove(article.id);
            article.title = articleChanged.title;
            article.summary = articleChanged.summary;
            article.content = articleChanged.content;
            article.tags = articleChanged.tags;
            return addArticle(article);
        }
        return false;
    }

    function getArticle(id) {
        return articlesMap.get(id);
    }

    function removeArticle(id) {
        articlesMap.remove(id);
        setToDatabase();
    }

    function getByIds(ids) {
        const ret = [];
        ids.forEach((id) => {
            ret.push(articlesMap.get(id));
        });
        return ret;
    }

    function getArticles(skip, top, filter) {
        const filteredArticles = getByIds(Object.keys(articlesMap.data)).filter((article) => {
            let ans = true;
            if (filter) {
                if (filter.author && filter.author !== article.author)
                    ans = false;
                if (filter.dateFrom && article.createdAt < filter.dateFrom)
                    ans = false;
                if (filter.dateTo && article.createdAt >= filter.dateTo)
                    ans = false;
                if (filter.tags != null)
                    filter.tags.forEach((item) => {
                        let currans = false;
                        article.tags.forEach((it) => {
                            if (it === item)
                                currans = true;
                        });
                        if (currans === false)
                            ans = false;
                    });
            }
            return ans;
        });
        filteredArticles.sort((a, b) => {
            if (a.createdAt > b.createdAt)
                return -1;
            return 1;
        });
        return filteredArticles.slice(skip, top);
    }

    function createID(param) {
        let ret = '';
        ret += articlesBaseService.getArticlesNumber();
        ret += param;
        return ret;
    }

    function createEmptyArticle(param) {
        return {
            id: createID(param),
            title: '',
            summary: '',
            createdAt: new Date(),
            author: '',
            content: '',
            tags: [''],
        };
    }

    return {
        createEmptyArticle,
        getMap,
        getAllAuthors,
        getAllTags,
        getArticles,
        getArticle,
        addArticle,
        editArticle,
        removeArticle,
        getByIds,
        getArticlesNumber,
        createID,
    };
}());
