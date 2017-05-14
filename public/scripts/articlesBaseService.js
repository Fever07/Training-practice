articlesBaseService = (function () {

    function getAllAuthors() {
        return new Promise((resolve, reject) => {
            httpService.makeRequest('GET', '/authorsGet')
                .then((result) => {
                    const parsed = JSON.parse(result);
                    const arr = [];
                    for (let key in parsed) {
                        if (key != '_id')
                            arr.push(key);
                    }
                    resolve(arr);
                }, (error) => {
                    reject(error);
                });
        });
    }

    function getAllTags() {
        return new Promise((resolve, reject) => {
            httpService.makeRequest('GET', '/tagsGet')
                .then((result) => {
                    const parsed = JSON.parse(result);
                    const arr = [];
                    for (let key in parsed) {
                        if (key != '_id')
                            arr.push(key);
                    }
                    resolve(arr);
                }, (error) => {
                    reject(error);
                });
            });
    }

    function getArticles(skip, top, filter) {
        return new Promise((resolve, reject) => {
            const req = {
                'skip': skip,
                'top': top,
                'filter': filter,
            };
            httpService.makeRequest('POST', '/articlesGet', JSON.stringify(req))
                .then((result) => {
                    const parsedResult = JSON.parse(result, (key, value) => {
                        if (key === 'createdAt') return new Date(value);
                        return value;
                    });
                    const articlesData = parsedResult[0];
                    const numOfFilteredArticles = parsedResult[1];
                    const ret = [];
                    ret.push(articlesData);
                    ret.push(numOfFilteredArticles);
                    resolve(ret);
                }, accessories.pointError);
        });
    }

    function editArticle(article, articleChanged) {
        return new Promise((resolve, reject) => {
            if (articleChanged.title && articleChanged.summary &&
                articleChanged.content && articleChanged.tags) {
                const req = {
                    'id': article.id,
                    'toChange': articleChanged,
                }
                httpService.makeRequest('POST', '/articlesEdit', JSON.stringify(req))
                    .then((res) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
            } else
                reject('Invalid changes!');
        });
    }

    function getArticle(id) {
        return new Promise((resolve, reject) => {
            httpService.makeRequest('POST', '/articlesGetById', JSON.stringify({'id': id}))
                .then((res) => {
                    const article = JSON.parse(res, (key, value) => {
                        if (key !== '_id') {
                            if (key === 'createdAt') return new Date(value);
                            return value;
                        }
                    });
                    resolve(article);
                }, (err) => {
                    reject(err);
                });
        });
    }

    function addArticle(article) {
        return new Promise((resolve, reject) => {
            if (validateArticle(article)) {
                httpService.makeRequest('POST', '/articlesAdd', JSON.stringify({'article': article}))
                    .then((res) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
            } else
                reject('Invalid article!');
        });
    }

    function removeArticle(id) {
        return new Promise((resolve, reject) => {
            httpService.makeRequest('POST', '/articlesRemove', JSON.stringify({'id': id}))
                .then((res) => {
                    console.log(res.responseText);
                    resolve(res);
                }, (err) => {
                    console.log(err.responseText);
                    reject(err);
                });
        });
    }

    function validateArticle(article) {
        return (article.id && article.title && article.summary &&
        article.content && article.author && article.tags);
    }

    function createID(param) {
        return new Promise((resolve, reject) => {
            httpService.makeRequest('GET', '/settingsId')
                .then((res) => {
                    resolve(res + param);
                }, (err) => {
                    console.log(err);
                });
        });
    }

    function createEmptyArticle(newId) {
        return {
            id: newId,
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
        createID,
        getArticles,
        editArticle,
        getArticle,
        addArticle,
        removeArticle,
        getAllAuthors,
        getAllTags,
    };
}());


