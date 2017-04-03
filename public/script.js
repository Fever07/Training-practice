var articlesBaseService = (function () {
    var articles = null;
    var tags = null;
    var users = null;

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

var accountsDatabase = (function () {

    var accounts = [
        {
            login: 'Vanvan',
            password: '123456',
            username: 'Иван Иванов'
        },
        {
            login: 'Nikoma',
            password: '1234567',
            username: 'Николай Малышев'
        },
        {
            login: 'Tanyusha',
            password: '777ppxx',
            username: 'Татьяна Терентьева'
        }
    ];

    function getAccount(login, password) {
        var foundAccount = accounts.filter(function (account) {
            return account.login === login;
        });
        if (foundAccount.length > 0 && foundAccount[0].password === password)
            return foundAccount[0];
        return null;
    }
    
    return {
        getAccount: getAccount
    }

}());


var viewService = (function () {

    const ROWS = 3, COLUMNS = 3;
    const states = ['feed', 'details', 'edit', 'add', 'login', 'submit', 'error'];
    var previousState = 'feed';
    var currentState = 'feed';
    var currentConfiguration = {
        currentState: 'feed'
    };
    var currentUser = '';
    var currentArticlesList = articlesBaseService.articles;
    var currentShownArticlesList = currentArticlesList.slice(0, 9);
    var currentFilter = {};
    var currentPage = 1;
    var currentArticle;
    
    function setToLocalStorage() {
        localStorage.setItem("previousState", previousState);
        localStorage.setItem("currentState", currentState);
        localStorage.setItem("currentUser", currentUser);
        localStorage.setItem("currentFilter", JSON.stringify(currentFilter));
        localStorage.setItem("currentPage", JSON.stringify(currentPage));
        localStorage.setItem("currentArticle", JSON.stringify(currentArticle));
    }
    
    (function getFromLocalStorage() {
        previousState = localStorage.getItem("previousState");
        currentState = localStorage.getItem("currentState");
        currentUser = localStorage.getItem("currentUser");
        currentFilter = JSON.parse(localStorage.getItem("currentFilter"), function (key, value) {
            if (key == "dateFrom" || key == "dateTo")
                return new Date(value);
            else
                return value;
        });
        currentPage = parseInt(JSON.parse(localStorage.getItem("currentPage")));
        currentArticle = JSON.parse(localStorage.getItem("currentArticle"), function (key, value) {
            if (key == "createdAt")
                return new Date(value);
            else
                return value;
        });

    }());

    function newState(newState, param) {
        previousState = currentState;
        currentState = newState;
        if (currentState == 'feed') {
            currentFilter = {};
            if (param)
                currentPage = param;
        } else if (currentState == 'details' || currentState == 'edit') {
            if (param)
                currentArticle = param;
        }
        setToLocalStorage();
    }

    function dateToString(date) {
        var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        return date.getDate() + ' '
            + months[date.getMonth()] + ' '
            + date.getFullYear() + 'г. | '
            + date.getUTCHours() + ':'
            + date.getMinutes();
    }

    function makeElement(tagName, className, id, innerHTML) {
        var elem = document.createElement(tagName);
        elem.className = className;
        elem.id = id;
        elem.innerHTML = innerHTML;
        return elem;
    }

    function updateMenu() {

        var row = document.getElementsByClassName("top-menu")[0].firstElementChild.firstElementChild;
        while (row.firstElementChild != null)
            row.removeChild(row.firstElementChild);
        if (currentUser != '') {
            row.appendChild(makeElement('td', '', '', '<b>' + currentUser + '</b>'));
            row.appendChild(makeElement('td', 'menu-item', 'feed', 'Главная'));
            row.appendChild(makeElement('td', 'menu-item', 'add', 'Добавить новость'));
            row.appendChild(makeElement('td', 'menu-item', 'exit', 'Выход'));
        }
        else {
            row.appendChild(makeElement('td', 'menu-item', 'feed', 'Главная'));
            row.appendChild(makeElement('td', 'menu-item', 'feed', 'Авторизация'));
        }
    }

    function init() {
        updateMenu();
        setterOfListeners.setMenuListeners();
        updateUI();
    }

    var setterOfListeners = (function () {

        function showLoginWindow() {

            function handleLogin(event) {
                var account = accountsDatabase.getAccount(document.getElementById('login').value, document.getElementById('password').value);
                if (account) {
                    currentUser = account.username;
                    setToLocalStorage();
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                    newState('feed');
                    updateMenu();
                    updateUI();
                } else {
                    loginWindow.getElementsByClassName('login-incorrect-message')[0].innerHTML = 'Неверные данные';
                }
            }

            var loginWindow = makeElement('div', 'popup-blackout', '',
                '        <div class="popup-window-login">'+
                '            <div class="login-header">'+
                '                <span class="header-pointer-login"><span class="header">Dat</span>News</span>'+
                '            </div>'+
                '            <div>'+
                '                <div class="login-text">'+
                '                    Логин:'+
                '                </div>'+
                '                <input type="text" class="login-input" id="login">'+
                '                <div class="login-text">'+
                '                    Пароль:'+
                '                </div>'+
                '                <input type="password" class="login-input" id="password">'+
                '                <div class="login-incorrect-message">' +
                '                   ' +
                '                </div>' +
                '                <div class="menu-item-container">'+
                '                    <div class="menu-item">'+
                '                        Вход'+
                '                    </div>'+
                '                </div>'+
                '            </div>'+
                '        </div>');
            document.getElementsByClassName('background')[0].insertBefore(loginWindow, document.getElementsByClassName('ground')[0]);
            loginWindow.addEventListener('click', function () {
                if (event.target.className == 'popup-blackout' || event.target.className == 'header-pointer-login')
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
            });
            document.onkeydown = function (event) {
                if (event.keyCode == 27) {
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                    document.onkeydown = null;
                }
            };
            loginWindow.getElementsByClassName('menu-item')[0].addEventListener('click', handleLogin);
        }

        function showSubmitDeleteWindow(id) {

            function handleSubmit(event) {
                if (event.target.className == 'submit-button') {
                    if (event.target.innerHTML == 'Да') {
                        articlesBaseService.removeArticle(id);
                        document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                        newState('feed');
                        updateUI();
                    } else {
                        document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                        newState(previousState);
                    }
                }
            }

            var submitDeleteWindow = makeElement('div', 'popup-blackout', '',
                '<div class="popup-window-submit">'+
                '            <div class="login-header">'+
                '                <span class="header-pointer-login"><span class="header">Dat</span>News</span>'+
                '            </div>'+
                '            <div>'+
                '                <div class="submit-question">'+
                '                    Удалить эту новость?'+
                '                </div>'+
                '                <table class="submit-buttons-table" align="center">'+
                '                    <tr>'+
                '                        <td class="menu-item">'+
                '                            <div class="submit-button">Да</div>'+
                '                        </td>'+
                '                        <td class="menu-item">'+
                '                            <div class="submit-button">Нет</div>'+
                '                        </td>'+
                '                    </tr>'+
                '                </table>'+
                '            </div>'+
                '        </div>'
            );

            document.getElementsByClassName('background')[0].insertBefore(submitDeleteWindow, document.getElementsByClassName('ground')[0]);
            submitDeleteWindow.addEventListener('click', function () {
                if (event.target.className == 'popup-blackout' || event.target.className == 'header-pointer-login')
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
            });
            document.onkeydown = function (event) {
                if (event.keyCode == 27) {
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                    document.onkeydown = null;
                }
            };
            submitDeleteWindow.getElementsByClassName('submit-buttons-table')[0].addEventListener('click', handleSubmit);

        }

        function handleMenu(event) {
            if (event.target.innerHTML == 'Главная' || event.target.className == 'header-pointer') {
                newState('feed', 1);
                updateUI();
            } else if (event.target.innerHTML == 'Добавить новость') {
                newState('add');
                updateUI();
            } else if (event.target.innerHTML == 'Авторизация') {
                showLoginWindow();
            } else if (event.target.innerHTML == 'Выход') {
                currentUser = '';
                setToLocalStorage();
                newState('feed', 1);
                updateMenu();
                updateUI();
            }
        }

        function handleFilter(event) {
            if (event.target.id == 'name-filter') {
                if (event.target.value == 'Все авторы')
                    currentFilter.author = null;
                else
                    currentFilter.author = event.target.value;
                currentPage = 1;
                setToLocalStorage();
                updateDynamic();
            } else if (event.target.id == 'tags-filter') {
                if (event.target.value == 'Все теги')
                    currentFilter.tags = null;
                else
                    currentFilter.tags = [event.target.value];
                currentPage = 1;
                setToLocalStorage();
                updateDynamic();
            } else if (event.target.id == 'date-from-filter') {
                currentFilter.dateFrom = new Date(event.target.value);
                console.log(currentFilter);
                currentPage = 1;
                setToLocalStorage();
                updateDynamic();
            } else if (event.target.id == 'date-to-filter') {
                currentFilter.dateTo = new Date(event.target.value);
                currentPage = 1;
                setToLocalStorage();
                updateDynamic();
            }
        }

        function handleDetails(event) {
            if (event.target.id != 'edit' && event.target.id != 'remove') {
                newState('details', articlesBaseService.getArticle(this.id));
                updateUI();
            }
        }

        function handleEdit(event) {
            if (event.target.id == 'edit') {
                if (currentState == 'feed')
                    newState('edit', articlesBaseService.getArticle(event.currentTarget.id));
                else
                    newState('edit');
                updateUI();
            }
        }

        function handleRemove(event) {
            if (event.target.id == 'remove') {
                if (currentState == 'details')
                    showSubmitDeleteWindow(currentArticle.id);
                else
                    showSubmitDeleteWindow(event.currentTarget.id);
            }

        }

        function handleSave() {
            if (document.getElementById('title').value == '' ||
                document.getElementById('summary').value == '' ||
                document.getElementById('content').value == '' ||
                document.getElementById('edit-tags-row').getElementsByClassName('edit-tag-element-container').length == 0 ||
                document.getElementById('edit-tags-row').getElementsByClassName('edit-tag-element-container').length > 5) {

            } else
            if (currentState == 'edit') {
                var articleChanged = {};
                articleChanged.title = document.getElementById('title').value;
                articleChanged.summary = document.getElementById('summary').value;
                articleChanged.content = document.getElementById('content').value;
                var tempTags = [];
                Array.prototype.filter.call(document.getElementById('edit-tags-row').childNodes, function (tagNode) {
                    tempTags.push(tagNode.id);
                });
                articleChanged.tags = tempTags;
                articlesBaseService.editArticle(currentArticle, articleChanged);
                newState(previousState);
                updateUI();
            } else {
                currentArticle = articlesBaseService.createEmptyArticle();
                currentArticle.title = document.getElementById('title').value;
                currentArticle.summary = document.getElementById('summary').value;
                currentArticle.content = document.getElementById('content').value;
                var tempTags = [];
                Array.prototype.filter.call(document.getElementById('edit-tags-row').getElementsByClassName('edit-tag-element-container'), function (tagNode) {
                    tempTags.push(tagNode.id);
                });
                currentArticle.tags = tempTags;
                currentArticle.author = currentUser;
                articlesBaseService.addArticle(currentArticle);
                newState('feed');
                updateUI();
            }
        }

        function handleCancel() {
            newState(previousState);
            updateUI();
        }

        function handlePagination() {
            if (event.target.className == 'pagination-elem') {
                currentPage = parseInt(event.target.id);
                setToLocalStorage();
                updateDynamic();
            }
        }

        function handleRemoveTag(event) {
            if (event.target.className == 'tag-remove') {
                var td = event.currentTarget;
                td.parentNode.removeChild(td);
            }
        }

        function handleAddTag(event) {
            var tagInput = document.getElementsByClassName('edit-tag-input')[0];
            if (tagInput.value != '') {
                var tagsRow = document.getElementById('edit-tags-row');
                var newTag = makeElement('td', 'edit-tag-element-container', tagInput.value,
                    '<div class="edit-tag-element">' +
                    '   <table class="edit-tag-element-table">' +
                    '       <tr id="' + tagInput.value + '">' +
                    '           <td class="tag-text">#' + tagInput.value + '</td>' +
                    '           <td class="tag-remove">✖</td>' +
                    '       </tr>' +
                    '   </table>' +
                    '</div>'
                );
                newTag.addEventListener('click', handleRemoveTag);
                tagsRow.appendChild(newTag);
                tagInput.value = '';
            }
        }

        function setMenuListeners() {
            document.getElementsByClassName("header-table")[0].addEventListener('click', handleMenu);
        }

        function setStaticListeners() {
            if (currentState == 'feed') {
                document.getElementById('name-filter').addEventListener('change', handleFilter);
                document.getElementById('tags-filter').addEventListener('change', handleFilter);
                document.getElementById('date-from-filter').addEventListener('change', handleFilter);
                document.getElementById('date-to-filter').addEventListener('change', handleFilter);
            } else if (currentState == 'details') {

            } else if (currentState == 'edit' || currentState == 'add') {
                document.getElementsByClassName("edit-bot-right-col")[0].addEventListener('click', handleSave);
                document.getElementsByClassName("edit-bot-right-col")[1].addEventListener('click', handleCancel);
                document.getElementById('edit-add-tag').addEventListener('click', handleAddTag);
            }
        }

        function setDynamicListeners() {
            if (currentState == 'feed') {
                var newsCells = document.getElementsByClassName("news-table")[0].getElementsByClassName("news-cell");
                Array.prototype.filter.call(newsCells, function (cell) {
                    cell.addEventListener('click', handleDetails);
                    cell.addEventListener('click', handleEdit);
                    cell.addEventListener('click', handleRemove);
                });
                document.getElementsByClassName("pagination")[0].addEventListener('click', handlePagination);
            } else if (currentState == 'details') {
                if (currentUser != '') {
                    document.getElementsByClassName("details-button")[0].addEventListener('click', handleEdit);
                    document.getElementsByClassName("details-button")[1].addEventListener('click', handleRemove);
                }
            } else if (currentState == 'edit' || currentState == 'add') {
                Array.prototype.filter.call(document.getElementById('edit-tags-row').getElementsByClassName('edit-tag-element-container'),
                    function (elem) {
                    elem.addEventListener('click', handleRemoveTag);
                });
            }
        }

        return {
            setMenuListeners: setMenuListeners,
            setStaticListeners: setStaticListeners,
            setDynamicListeners: setDynamicListeners
        }
    }());

    function updateUI() {
        updateStatic();
        updateDynamic();
    }

    function updateStatic() {
        var divMain = document.getElementById('main');
        divMain.parentNode.removeChild(divMain);
        if (currentState == 'feed') {
            divMain = makeElement('div', 'feed', 'main',
                '<table class="central">'+
                '                   <tr>'+
                '<td class="left-panel">'+'</td>'+
                '                        <td>'+
                '                            <table class="news-table">'+
                '                                <tr>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                </tr>'+
                '                                <tr>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                </tr>'+
                '                                <tr>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                    <td class="news-cell-td"></td>'+
                '                                </tr>'+
                '                            </table>'+
                '                        </td>'+
                '                        <td class="right-panel">'+
                '                            <ul class="filter-list">'+
                '                                <li class="filter-element">'+
                '                                    <select class="filter" id="name-filter">'+
                '                                        <option id="-1">'+'Все авторы'+'</option>'+
                '                                    </select>'+
                '                                </li>'+
                '                                <li class="filter-element">'+
                '                                    <select class="filter" id="tags-filter">'+
                '                                        <option id="-1">'+'Все теги'+'</option>'+
                '                                    </select>'+
                '                                </li>'+
                '                                <li class="filter-element">'+
                '                                   <input type="date" class="filter" min="2017-01-01" max="2025-01-01" id="date-from-filter">' +
                '                                </li>'+
                '                                <li class="filter-element">'+
                '                                   <input type="date" class="filter" min="2017-01-01" max="2025-01-01" id="date-to-filter">' +
                '                                </li>'+
                '                            </ul>'+
                '                        </td>'+
                '                    </tr>'+
                '                </table>'+
                '            </div>'+
                '            <table class="pagination">'+
                '                <tr>'+
                '                </tr>'+
                '            </table>');
            document.getElementsByClassName('ground')[0].insertBefore(divMain, document.getElementsByClassName('footer')[0]);
            setToLocalStorage();
            var selectUsers = document.getElementById('name-filter');
            articlesBaseService.users.forEach(function (user, i) {
                selectUsers.appendChild(makeElement('option', '', i, user));
            });
            var selectTags = document.getElementById('tags-filter');
            articlesBaseService.tags.forEach(function (tag, i) {
                selectTags.appendChild(makeElement('option', '', i, tag));
            });
        } else if (currentState == 'details') {
            divMain = makeElement('div', 'details-central', 'main',
                '<div class="details-title">' +
                '</div>' +
                '<table class="details-author-and-buttons">' +
                    '<tr>' +
                        '<td class="details-author-td">' +
                            '<div class="details-author">' +
                            '</div>' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
                '<div class="details-author">' +
                '</div>' +
                '<hr size="2" color="black">' +
                '<div class="details-content">' +
                '</div>' +
                '<div class="details-tags">' +
                '</div>' +
                '<div class="details-date">' +
                '</div>');
            document.getElementsByClassName('ground')[0].insertBefore(divMain, document.getElementsByClassName('footer')[0]);
        } else if (currentState == 'edit' || currentState == 'add') {
            divMain = makeElement('div', 'edit-central', 'main',
                '            <div class="edit-top">'+
                '                <table class="edit-central-table">'+
                '                    <tr class="edit-top">'+
                '                        <td class="edit-top-left-col">'+
                '                            Добавить / Редактировать новость'+
                '                        </td>'+
                '                        <td class="edit-top-right-col">'+
                '                        </td>'+
                '                    </tr>'+
                '                </table>'+
                '            </div>'+
                '            <div>'+
                '                <form>'+
                '                    <input class="edit-form" type="text" placeholder="Заголовок..." maxlength="100" id="title">'+
                '                </form>'+
                '            </div>'+
                '            <div>'+
                '                <form>'+
                '                    <textarea class="edit-form-summary" placeholder="Краткое описание..." maxlength="200" id="summary"></textarea>'+
                '                </form>'+
                '            </div>'+
                '            <div>'+
                '                <table class="edit-tags-table">'+
                '                    <tr>'+
                '                        <td class="edit-tags-td" align="left">'+
                '                            <table class="edit-tags">'+
                '                                <tr id="edit-tags-row">'+
                '                                </tr>'+
                '                            </table>'+
                '                        </td>'+
                '                        <td class="edit-tags-add" align="right">'+
                '                            <table>'+
                '                                <tr>'+
                '                                    <td>'+
                '                                        <div class="edit-tag-input-container" align="right">'+
                '                                            <input type="text" class="edit-tag-input">'+
                '                                        </div>'+
                '                                    </td>'+
                '                                    <td>'+
                '                                        <div>'+
                '                                            <button id="edit-add-tag">+</button>'+
                '                                        </div>'+
                '                                    </td>'+
                '                                </tr>'+
                '                            </table>'+
                '                        </td>'+
                '                    </tr>'+
                '                </table>'+
                '            </div>'+
                '            <div>'+
                '                <form>'+
                '                    <textarea class="edit-form-content" placeholder="Текст..." rows="10" id="content"></textarea>'+
                '                </form>'+
                '            </div>'+
                '            <div class="edit-bot">'+
                '                <table class="edit-central-table">'+
                '                    <tr>'+
                '                        <td class="edit-bot-left-col">'+
                '                        </td>'+
                '                        <td class="edit-bot-right-col">'+
                '                            Сохранить'+
                '                        </td>'+
                '                        <td class="edit-bot-right-col">'+
                '                            Отмена'+
                '                        </td>'+
                '                    </tr>'+
                '                </table>'+
                '            </div>');
            document.getElementsByClassName('ground')[0].insertBefore(divMain, document.getElementsByClassName('footer')[0]);
        }
        setterOfListeners.setStaticListeners();
    }

    function updateDynamic() {
        if (currentState == 'feed') {
            currentArticlesList = articlesBaseService.getArticles(0, articlesBaseService.articles.length, currentFilter);
            var currentNumOfPages = (currentArticlesList.length + 8) / 9 | 0;
            currentShownArticlesList = currentArticlesList.slice((currentPage - 1) * 9, currentPage * 9);
            var newsTable = document.getElementsByClassName("news-table")[0];
            var row = newsTable.firstElementChild.firstElementChild;
            var td = row.firstElementChild;
            while (row != null) {
                while (td != null) {
                    if (td.firstElementChild != null)
                        td.removeChild(td.firstElementChild);
                    td = td.nextElementSibling;
                }
                row = row.nextElementSibling;
                if (row != null)
                    td = row.firstElementChild;
            }
            if (currentArticlesList.length > 0) {
                row = newsTable.firstElementChild.firstElementChild;
                td = row.firstElementChild;
                currentShownArticlesList.forEach(function (article) {
                    var cell = makeElement('div', 'news-cell', article.id, '');
                    var tempHTML =
                        '<span class="news-title" id="' + article.id + '">' + article.title + '</span>' + '\n' +
                        '<br>' + '\n' +
                        '<span class="author" id="' + article.id + '">' + article.author + '</span>' + '\n' +
                        '<hr size="2" color="white">' + '\n' +
                        '<span class="news-text" id="' + article.id + '">' + article.summary + '</span>' + '\n' +
                        '<br>' + '\n' +
                        '<br>' + '\n';
                    article.tags.forEach(function (tag) {
                        tempHTML += '<span class="tag" id="' + article.id + '">' + '#' + tag + '</span> ';
                    });
                    tempHTML +=
                        '' + '\n' +
                        '<hr size="1" color="lightgray">' + '\n' +
                        '<table class="news-date-edit" id="' + article.id + '">'+
                            '<tr>'+
                                '<td id="' + article.id + '">' + dateToString(article.createdAt) + '</td>';
                                if (currentUser != '') {
                                    tempHTML += '<td class="news-cell-button" id="edit">✎</td>' +
                                    '<td class="news-cell-button" id="remove">✖</td>';
                                }
                    tempHTML += '</tr>' +
                        '</table>'
                    ;
                    cell.innerHTML = tempHTML;
                    td.appendChild(cell);
                    td = td.nextElementSibling;
                    if (td == null) {
                        row = row.nextElementSibling;
                        if (row != null)
                            td = row.firstElementChild;
                    }
                });
                if (currentFilter.author)
                    document.getElementById('name-filter').value = currentFilter.author;
                if (currentFilter.tags)
                    document.getElementById('tags-filter').value = currentFilter.tags;

                function dateToFilterFormat(date) {
                    var ret = '' + date.getFullYear();
                    var month = date.getMonth() + 1;
                    if (month < 10)
                        ret += '-0' + month;
                    else
                        ret += '-' + month;
                    var day = date.getDate();
                    if (day < 10)
                        ret += '-0' + day;
                    else
                        ret += '-' + day;
                    return ret;
                }

                if (currentFilter.dateFrom)
                    document.getElementById('date-from-filter').value = dateToFilterFormat(currentFilter.dateFrom);
                if (currentFilter.dateTo)
                    document.getElementById('date-to-filter').value = dateToFilterFormat(currentFilter.dateTo);
                var paginationRow = document.getElementsByClassName('pagination')[0].firstElementChild.firstElementChild;
                while (paginationRow.firstElementChild != null)
                    paginationRow.removeChild(paginationRow.firstElementChild);

                    function addElemToPagination(row, id, content, ifChosen) {
                        if (ifChosen)
                            row.appendChild(makeElement('td', 'pagination-elem-chosen', id, content));
                        else
                            row.appendChild(makeElement('td', 'pagination-elem', id, content));
                    }

                    if (currentPage >= 3)
                        addElemToPagination(paginationRow, currentPage - 2, '...');
                    if (currentPage >= 2)
                        addElemToPagination(paginationRow, currentPage - 1, currentPage - 1);
                    addElemToPagination(paginationRow, currentPage, currentPage, true);
                    if (currentPage <= currentNumOfPages - 1)
                        addElemToPagination(paginationRow, currentPage + 1, currentPage + 1);
                    if (currentPage <= currentNumOfPages - 2)
                        addElemToPagination(paginationRow, currentPage + 2, '...');

            } else {
                var paginationRow = document.getElementsByClassName('pagination')[0].firstElementChild.firstElementChild;
                while (paginationRow.firstElementChild != null)
                    paginationRow.removeChild(paginationRow.firstElementChild);
            }
        } else if (currentState == 'details') {
            var detailsDiv = document.getElementsByClassName('details-central')[0];
            detailsDiv.getElementsByClassName('details-title')[0].innerHTML = currentArticle.title;
            detailsDiv.getElementsByClassName('details-author')[0].innerHTML = currentArticle.author;
            detailsDiv.getElementsByClassName('details-content')[0].innerHTML = currentArticle.content;
            var tagHTML = '';
            currentArticle.tags.forEach(function (tag) {
                tagHTML = tagHTML + '#' + tag + ' ';
            });
            detailsDiv.getElementsByClassName('details-tags')[0].innerHTML = tagHTML;
            detailsDiv.getElementsByClassName('details-date')[0].innerHTML = dateToString(currentArticle.createdAt);
            if (currentUser != '') {
                var authorAndButtons = detailsDiv.getElementsByClassName('details-author-and-buttons')[0];
                authorAndButtons.firstElementChild.firstElementChild.appendChild(makeElement('td', 'details-button', '', '<span class="details-button-text" id="edit">✎</span>'));
                authorAndButtons.firstElementChild.firstElementChild.appendChild(makeElement('td', 'details-button', '', '<span class="details-button-text" id="remove">✖</span>'));
            }
        } else if (currentState == 'edit') {
            document.getElementsByClassName('edit-top-right-col')[0].innerHTML = 'ID: ' + currentArticle.id;
            document.getElementsByClassName('edit-bot-left-col')[0].innerHTML = currentArticle.author + ', ' + dateToString(currentArticle.createdAt);
            document.getElementById('title').value = currentArticle.title;
            document.getElementById('summary').value = currentArticle.summary;
            var tagsRow = document.getElementById('edit-tags-row');
            tagsRow.parentNode.removeChild(tagsRow);
            tagsRow = makeElement('tr', '', 'edit-tags-row', '');
            currentArticle.tags.forEach(function (tag) {
                tagsRow.appendChild(makeElement('td', 'edit-tag-element-container', tag,
                    '<div class="edit-tag-element">'+
                    '   <table class="edit-tag-element-table">'+
                    '       <tr id="' + tag + '">'+
                    '           <td class="tag-text">#' + tag + '</td>'+
                    '           <td class="tag-remove">✖</td>'+
                    '       </tr>'+
                    '   </table>'+
                    '</div>'
                ));
            });
            document.getElementsByClassName('edit-tags')[0].firstElementChild.appendChild(tagsRow);
            document.getElementById('content').value = currentArticle.content;
        } else if (currentState == 'add') {
            document.getElementsByClassName('edit-top-right-col')[0].innerHTML = 'ID: ' + articlesBaseService.articles.length;
            document.getElementsByClassName('edit-bot-left-col')[0].innerHTML = currentUser + ', ' + dateToString(new Date());
        }
        setterOfListeners.setDynamicListeners();
        setToLocalStorage();
    }

    return {
        init: init
    }

}());

viewService.init();
