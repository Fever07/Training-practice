articlesBaseService = (function () {

    function setToLocalStorage(ifArticles, ifTags, ifUsers) {
        if (ifArticles)
            localStorage.setItem("articles", JSON.stringify(articles));
        if (ifTags)
            localStorage.setItem("tags", JSON.stringify(tags));
        if (ifUsers)
            localStorage.setItem("users", JSON.stringify(users));
    }

    (function getFromLocalStorage(ifArticles, ifTags, ifUsers) {
        if (ifArticles)
            articles = JSON.parse(localStorage.getItem('articles'), function (key, value) {
                if (key == "createdAt")
                    return new Date(value);
                else
                    return value;
            });
        if (ifTags)
            tags = JSON.parse(localStorage.getItem('tags'));
        if (ifUsers)
            users = JSON.parse(localStorage.getItem('users'));
    }(1, 1, 1));

    function addTag(tag) {
        if (tags.indexOf(tag) === -1) {
            tags.push(tag);
            tags.sort();
            setToLocalStorage(0, 1, 0);
            return true;
        } else
            return false;
    }

    function removeTag(article, tag) {
        var fnd = article.tags.indexOf(tag);
        if (fnd != -1) {
            article.tags.splice(fnd, 1);
            setToLocalStorage(1, 0, 0);
            return true;
        } else
            return false;
    }

    function compareDate(a, b) {
        if (a.createdAt > b.createdAt)
            return -1;
        else
            return 1;
    }

    function isSatisfyingFilter(article, filter) {
        var ans = true;
        if (typeof filter != 'undefined') {
            if (typeof filter.author === 'string')
                if (article.author != filter.author)
                    ans = false;
            if (typeof filter.dateFrom === 'object')
                if (article.createdAt < filter.dateFrom)
                    ans = false;
            if (typeof filter.dateTo === 'object')
                if (article.createdAt > filter.dateTo)
                    ans = false;
            if (typeof filter.tags === 'object')
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
    }

    function getArticles(skip, top, filter) {
        var filteredArticles = articles.filter(function (article) {
            var ans = true;
            if (typeof filter != 'undefined') {
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

    function getArticle(id) {
        return articles.filter(function (article) {
            return article.id == id;
        })[0];
    }

    function validateArticle(article) {
        return (article.id && article.title && article.summary && article.content && article.author && article.tags);
    }

    function addArticle(article) {
        if (validateArticle(article)) {
            article.createdAt = new Date();
            articles.push(article);
            article.tags.forEach(
                function (item, i, arr) {
                    addTag(item);
                }
            );
            articles.sort(compareDate);
            setToLocalStorage(1, 1, 0);
            return true;
        } else
            return false;

    }

    function createEmptyArticle() {
        return {
            id: '' + articles.length,
            title: '',
            summary: '',
            createdAt: new Date(),
            author: '',
            content: '',
            tags: ['']
        }
    }

    function editArticle(article, articleChanged) {
        if (articleChanged.title && articleChanged.summary && articleChanged.content && articleChanged.tags) {
            article.title = articleChanged.title;
            article.summary = articleChanged.summary;
            article.content = articleChanged.content;
            article.tags = articleChanged.tags;
            article.tags.forEach(
                function (item) {
                    addTag(item);
                }
            );
            setToLocalStorage(1, 1, 0);
        }
    }

    function removeArticle(id) {
        articles.splice(articles.indexOf(getArticle(id)), 1);
        setToLocalStorage(1, 0, 0);
    }

    return {
        getArticles: getArticles,
        getArticle: getArticle,
        addArticle: addArticle,
        editArticle: editArticle,
        removeArticle: removeArticle,
        createEmptyArticle: createEmptyArticle,
        removeTag: removeTag,
        articles: articles,
        users: users,
        tags: tags
    }

}());
