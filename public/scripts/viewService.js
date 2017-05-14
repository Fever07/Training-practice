viewService = (function () {

    const PAGES = 9;

    let currentConfiguration;

    function setToDatabase() {
        httpService.makeRequest('POST', '/currconfig', JSON.stringify(currentConfiguration))
            .then((result) => {

            }, accessories.pointError);
    }

    function newState(newst, param) {
        currentConfiguration.previousState = currentConfiguration.currentState;
        currentConfiguration.currentState = newst;
        if (currentConfiguration.currentState === 'feed') {
            if (param)
                currentConfiguration.currentPage = param;
        } else if (currentConfiguration.currentState === 'details' || currentConfiguration.currentState === 'edit') {
            if (param)
                currentConfiguration.currentArticle = param;
        }
        setToDatabase();
    }

    function dateToString(date) {
        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        const minutes = date.getMinutes();
        let minStr;
        if (minutes < 10)
            minStr = `0${minutes}`;
        else
            minStr = `${minutes}`;
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} г. | ${date.getUTCHours()}:${minStr}`;
    }

    function dateToFilterFormat(date) {
        let ret = `${date.getFullYear()}`;
        const month = date.getMonth() + 1;
        if (month < 10)
            ret += `-0${month}`;
        else
            ret += `-${month}`;
        const day = date.getDate();
        if (day < 10)
            ret += `-0${day}`;
        else
            ret += `-${day}`;
        return ret;
    }

    function makeElement(tagName, className, id, innerHTML) {
        const elem = document.createElement(tagName);
        elem.className = className;
        elem.id = id;
        elem.innerHTML = innerHTML;
        return elem;
    }

    function addElemToPagination(row, id, content, ifChosen) {
        if (ifChosen)
            row.appendChild(makeElement('td', 'pagination-elem-chosen', id, content));
        else
            row.appendChild(makeElement('td', 'pagination-elem', id, content));
    }

    function updateMenu() {
        const row = document.getElementsByClassName('top-menu')[0].firstElementChild.firstElementChild;
        while (row.firstElementChild !== null)
            row.removeChild(row.firstElementChild);
        if (currentConfiguration.currentUser !== '') {
            row.appendChild(makeElement('td', '', '', `<b>${currentConfiguration.currentUser}</b>`));
            row.appendChild(makeElement('td', 'menu-item', 'feed', 'Главная'));
            row.appendChild(makeElement('td', 'menu-item', 'add', 'Добавить новость'));
            row.appendChild(makeElement('td', 'menu-item', 'exit', 'Выход'));
        } else {
            row.appendChild(makeElement('td', 'menu-item', 'feed', 'Главная'));
            row.appendChild(makeElement('td', 'menu-item', 'feed', 'Авторизация'));
        }
    }

    function init() {
        httpService.makeRequest('GET', '/currconfig')
            .then((result) => {
                currentConfiguration = JSON.parse(result, (key, value) => {
                    if (key === 'dateFrom' || key === 'dateTo' || key === 'createdAt')
                        return new Date(value);
                    if (key === 'currentPage')
                        return parseInt(value, 10);
                    return value;
                })[0];
                updateMenu();
                setterOfListeners.setMenuListeners();
                updateUI();
            }, accessories.pointError);
    }

    const setterOfListeners = (function () {

        function showLoginWindow() {

            function handleLogin() {
                const account = accountsDatabase.getAccount(document.getElementById('login').value, document.getElementById('password').value);
                if (account) {
                    currentConfiguration.currentUser = account.username;
                    setToDatabase();
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                    document.onkeydown = null;
                    newState('feed');
                    updateMenu();
                    updateUI();
                } else {
                    loginWindow.getElementsByClassName('login-incorrect-message')[0].innerHTML = 'Неверные данные';
                }
            }

            const loginWindow = document.querySelector('#login-window').content.querySelector('div').cloneNode(true);
            document.getElementsByClassName('background')[0].insertBefore(loginWindow, document.getElementsByClassName('ground')[0]);
            loginWindow.addEventListener('click', (event) => {
                if (event.target.className === 'popup-blackout' || event.target.className === 'header-pointer-login')
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
            });
            document.onkeydown = function (event) {
                if (event.keyCode === 27) {
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                    document.onkeydown = null;
                } else if (event.keyCode === 13) {
                    handleLogin();
                }
            };
            loginWindow.getElementsByClassName('menu-item')[0].addEventListener('click', handleLogin);
        }

        function showSubmitDeleteWindow(id) {

            function handleSubmit(event) {
                if (event.target.className === 'submit-button') {
                    if (event.target.innerHTML === 'Да') {
                        articlesBaseService.removeArticle(id)
                            .then((res) => {
                                document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                                newState('feed');
                                updateUI();
                            }, accessories.pointError);
                    } else {
                        document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                        newState(currentConfiguration.previousState);
                    }
                }
            }

            const submitDeleteWindow = document.querySelector('#submit-delete-window').content.querySelector('div').cloneNode(true);
            document.getElementsByClassName('background')[0].insertBefore(submitDeleteWindow, document.getElementsByClassName('ground')[0]);
            submitDeleteWindow.addEventListener('click', (event) => {
                if (event.target.className === 'popup-blackout' || event.target.className === 'header-pointer-login')
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
            });
            document.onkeydown = function (event) {
                if (event.keyCode === 27) {
                    document.getElementsByClassName('background')[0].removeChild(document.getElementsByClassName('popup-blackout')[0]);
                    document.onkeydown = null;
                }
            };
            submitDeleteWindow.getElementsByClassName('submit-buttons-table')[0].addEventListener('click', handleSubmit);

        }

        function handleMenu(event) {
            if (event.target.innerHTML === 'Главная' || event.target.className === 'header-pointer') {
                newState('feed', 1);
                updateUI();
            } else if (event.target.innerHTML === 'Добавить новость') {
                newState('add');
                updateUI();
            } else if (event.target.innerHTML === 'Авторизация') {
                showLoginWindow();
            } else if (event.target.innerHTML === 'Выход') {
                currentConfiguration.currentUser = '';
                setToDatabase();
                newState('feed', 1);
                updateMenu();
                updateUI();
            }
        }

        function handleFilter(event) {

            const minDate = '2015-01-01';
            const maxDate = '2025-01-01';

            let changedFilter = false;

            if (event.target.id === 'name-filter') {
                if (event.target.value === 'Все авторы')
                    currentConfiguration.currentFilter.author = null;
                else
                    currentConfiguration.currentFilter.author = event.target.value;
                changedFilter = true;
                currentConfiguration.currentPage = 1;
            } else if (event.target.id === 'tags-filter') {
                if (event.target.value === 'Все теги')
                    currentConfiguration.currentFilter.tags = null;
                else
                    currentConfiguration.currentFilter.tags = event.target.value;
                changedFilter = true;
                currentConfiguration.currentPage = 1;
            } else if (event.target.id === 'date-from-filter') {
                if (event.target.value !== '' && event.target.value >= minDate) {
                    currentConfiguration.currentFilter.dateFrom = new Date(event.target.value);
                    currentConfiguration.currentPage = 1;
                } else {
                    currentConfiguration.currentFilter.dateFrom = new Date(minDate);
                    currentConfiguration.currentPage = 1;
                }
                changedFilter = true;
            } else if (event.target.id === 'date-to-filter') {
                if (event.target.value !== '' && event.target.value <= maxDate) {
                    currentConfiguration.currentFilter.dateTo = new Date(event.target.value);
                    currentConfiguration.currentPage = 1;
                } else {
                    currentConfiguration.currentFilter.dateTo = new Date(maxDate);
                    currentConfiguration.currentPage = 1;
                }
                changedFilter = true;
            }

            if (changedFilter) {
                setToDatabase();
                articlesBaseService.getArticles(
                    (currentConfiguration.currentPage - 1) * PAGES, currentConfiguration.currentPage * PAGES, currentConfiguration.currentFilter)
                    .then((result) => {
                        updateDynamic(result);
                    }, accessories.pointError);
            }
        }

        function handleDetails(event) {
            if (event.target.id !== 'edit' && event.target.id !== 'remove') {
                articlesBaseService.getArticle(this.id)
                    .then((res) => {
                        newState('details', res);
                        updateUI();
                    }, accessories.pointError);
            }
        }

        function handleEdit(event) {
            if (event.target.id === 'edit') {
                articlesBaseService.getArticle(this.id)
                    .then((res) => {
                        newState('edit', res);
                        updateUI();
                    }, accessories.pointError);

            }
        }

        function handleRemove(event) {
            if (event.target.id === 'remove') {
                if (currentConfiguration.currentState === 'details')
                    showSubmitDeleteWindow(currentConfiguration.currentArticle.id);
                else
                    showSubmitDeleteWindow(event.currentTarget.id);
            }
        }

        function handleSave() {
            if (!(document.getElementById('title').value === '' ||
                document.getElementById('summary').value === '' ||
                document.getElementById('content').value === '' ||
                document.getElementById('edit-tags-row').getElementsByClassName('edit-tag-element-container').length === 0 ||
                document.getElementById('edit-tags-row').getElementsByClassName('edit-tag-element-container').length > 5)) {
                if (currentConfiguration.currentState === 'edit') {
                    const articleChanged = {};
                    articleChanged.title = document.getElementById('title').value;
                    articleChanged.summary = document.getElementById('summary').value;
                    articleChanged.content = document.getElementById('content').value;
                    const tempTags = [];
                    Array.prototype.filter.call(document.getElementById('edit-tags-row').childNodes, (tagNode) => {
                        tempTags.push(tagNode.id);
                    });
                    articleChanged.tags = tempTags;
                    articlesBaseService.editArticle(currentConfiguration.currentArticle, articleChanged)
                        .then((res) => {
                            if (currentConfiguration.previousState === 'details') {
                                articlesBaseService.getArticle(currentConfiguration.currentArticle.id)
                                    .then((res) => {
                                        newState(currentConfiguration.previousState, res);
                                        updateUI();
                                    }, accessories.pointError);
                            } else {
                                newState(currentConfiguration.previousState);
                                updateUI();
                            }
                        }, accessories.pointError);
                } else {
                    const id = document.getElementsByClassName('edit-add-container')[0].id;
                    currentConfiguration.currentArticle = articlesBaseService.createEmptyArticle(id);
                    currentConfiguration.currentArticle.title = document.getElementById('title').value;
                    currentConfiguration.currentArticle.summary = document.getElementById('summary').value;
                    currentConfiguration.currentArticle.content = document.getElementById('content').value;
                    const tempTags = [];
                    Array.prototype.filter.call(document.getElementById('edit-tags-row').getElementsByClassName('edit-tag-element-container'), (tagNode) => {
                        tempTags.push(tagNode.id);
                    });
                    currentConfiguration.currentArticle.tags = tempTags;
                    currentConfiguration.currentArticle.author = currentConfiguration.currentUser;
                    articlesBaseService.addArticle(currentConfiguration.currentArticle)
                        .then((res) => {
                            newState('feed');
                            updateUI();
                        }, (err) => {
                            console.log(err);
                            newState('feed');
                            updateUI();
                        });
                }
            }
        }

        function handleCancel() {
            newState(currentConfiguration.previousState);
            updateUI();
        }

        function handlePagination(event) {
            if (event.target.className === 'pagination-elem') {
                currentConfiguration.currentPage = parseInt(event.target.id, 10);
                setToDatabase();
                articlesBaseService.getArticles(
                    (currentConfiguration.currentPage - 1) * PAGES, currentConfiguration.currentPage * PAGES, currentConfiguration.currentFilter)
                    .then((result) => {
                        updateDynamic(result);
                    }, accessories.pointError);
            }
        }

        function handleRemoveTag(event) {
            if (event.target.className === 'tag-remove') {
                const td = event.currentTarget;
                td.parentNode.removeChild(td);
            }
        }

        function handleAddTag() {
            const tagInput = document.getElementsByClassName('edit-tag-input')[0];
            if (tagInput.value !== '') {
                const tagsRow = document.getElementById('edit-tags-row');
                const newTag = document.querySelector('#template-edit-tag').content.querySelector('td').cloneNode(true);
                newTag.id = tagInput.value;
                newTag.querySelector('.tag-text').textContent = `# ${tagInput.value}`;
                newTag.addEventListener('click', handleRemoveTag);
                tagsRow.appendChild(newTag);
                tagInput.value = '';
            }
        }

        function setMenuListeners() {
            document.getElementsByClassName('header-table')[0].addEventListener('click', handleMenu);
        }

        function setStaticListeners() {
            if (currentConfiguration.currentState === 'feed') {
                document.getElementById('name-filter').addEventListener('change', handleFilter);
                document.getElementById('tags-filter').addEventListener('change', handleFilter);
                document.getElementById('date-from-filter').addEventListener('change', handleFilter);
                document.getElementById('date-to-filter').addEventListener('change', handleFilter);
            } else if (currentConfiguration.currentState === 'edit' || currentConfiguration.currentState === 'add') {
                document.getElementsByClassName('edit-bot-right-col')[0].addEventListener('click', handleSave);
                document.getElementsByClassName('edit-bot-right-col')[1].addEventListener('click', handleCancel);
                document.getElementById('edit-add-tag').addEventListener('click', handleAddTag);
            }
        }

        function setDynamicListeners() {
            if (currentConfiguration.currentState === 'feed') {
                const newsCells = document.getElementsByClassName('news-table')[0].getElementsByClassName('news-cell');
                Array.prototype.filter.call(newsCells, (cell) => {
                    cell.addEventListener('click', handleDetails);
                    cell.addEventListener('click', handleEdit);
                    cell.addEventListener('click', handleRemove);
                });
                document.getElementsByClassName('pagination')[0].addEventListener('click', handlePagination);
            } else if (currentConfiguration.currentState === 'details') {
                if (currentConfiguration.currentUser !== '') {
                    document.getElementsByClassName('details-container')[0].addEventListener('click', handleEdit);
                    document.getElementsByClassName('details-container')[0].addEventListener('click', handleRemove);
                }
            } else if (currentConfiguration.currentState === 'edit' || currentConfiguration.currentState === 'add') {
                Array.prototype.filter.call(document.getElementById('edit-tags-row').getElementsByClassName('edit-tag-element-container'),
                    (elem) => {
                        elem.addEventListener('click', handleRemoveTag);
                    });
            }
        }

        return {
            setMenuListeners,
            setStaticListeners,
            setDynamicListeners,
        };

    }());

    function updateUI() {
        if (currentConfiguration.currentState === 'feed')
            articlesBaseService.getAllAuthors().then(
                (result) =>  {
                    const param = [];
                    param[0] = result;
                    articlesBaseService.getAllTags().then(
                        (result) => {
                            param[1] = result;
                            updateStatic(param);
                            articlesBaseService.getArticles(
                                (currentConfiguration.currentPage - 1) * PAGES, currentConfiguration.currentPage * PAGES, currentConfiguration.currentFilter)
                                .then((result) => {
                                    updateDynamic(result);
                                }, accessories.pointError);
                        }, accessories.pointError
                    );
                }, accessories.pointError
            );
        else if (currentConfiguration.currentState === 'add') {
            updateStatic();
            articlesBaseService.createID(currentConfiguration.currentUser[0])
                .then((result) => {
                    updateDynamic(result);
                }, accessories.pointError);
        } else {
            updateStatic();
            updateDynamic();
        }
    }

    function updateStatic(param) {
        let divMain = document.getElementById('main');
        divMain.parentNode.removeChild(divMain);
        if (currentConfiguration.currentState === 'feed') {
            divMain = document.querySelector('#feed-div-main').content.querySelector('div').cloneNode(true);
            document.getElementsByClassName('ground')[0].insertBefore(divMain, document.getElementsByClassName('footer')[0]);
            const selectUsers = document.getElementById('name-filter');
            param[0].forEach((user, i) => {
                selectUsers.appendChild(makeElement('option', '', i, user));
            });
            const selectTags = document.getElementById('tags-filter');
            param[1].forEach((tag, i) => {
                selectTags.appendChild(makeElement('option', '', i, tag));
            });
        } else if (currentConfiguration.currentState === 'details') {
            divMain = document.querySelector('#details-div-main').content.querySelector('div').cloneNode(true);
            document.getElementsByClassName('ground')[0].insertBefore(divMain, document.getElementsByClassName('footer')[0]);
        } else if (currentConfiguration.currentState === 'edit' || currentConfiguration.currentState === 'add') {
            divMain = document.querySelector('#edit-add-div-main').content.querySelector('div').cloneNode(true);
            document.getElementsByClassName('ground')[0].insertBefore(divMain, document.getElementsByClassName('footer')[0]);
        }
        setterOfListeners.setStaticListeners();
    }

    function updateDynamic(param) {
        if (currentConfiguration.currentState === 'feed') {
            const currentShownArticlesList = param[0];
            const currentNumOfPages = (param[1] + (PAGES - 1)) / PAGES | 0;
            const newsTable = document.getElementsByClassName('news-table')[0];
            let row = newsTable.firstElementChild.firstElementChild;
            let td = row.firstElementChild;

            while (row !== null) {
                while (td !== null) {
                    if (td.firstElementChild !== null)
                        td.removeChild(td.firstElementChild);
                    td = td.nextElementSibling;
                }
                row = row.nextElementSibling;
                if (row !== null)
                    td = row.firstElementChild;
            }
            if (currentShownArticlesList.length > 0) {
                row = newsTable.firstElementChild.firstElementChild;
                td = row.firstElementChild;
                currentShownArticlesList.forEach((article) => {
                    const cell = document.querySelector('#template-news-cell').content.querySelector('div').cloneNode(true);
                    cell.id = article.id;
                    cell.querySelector('.news-title').textContent = article.title;
                    cell.querySelector('.news-author').textContent = article.author;
                    cell.querySelector('.news-text').textContent = article.summary;
                    cell.querySelector('.news-date').textContent = dateToString(article.createdAt);
                    article.tags.forEach((tag) => {
                        cell.querySelector('.news-tags-row').appendChild(makeElement('span', 'tag', '', `#${tag} `));
                    });
                    if (currentConfiguration.currentUser !== '') {
                        cell.querySelector('.news-date-edit').firstElementChild.firstElementChild.appendChild(makeElement('td', 'news-cell-button', 'edit', '✎'));
                        cell.querySelector('.news-date-edit').firstElementChild.firstElementChild.appendChild(makeElement('td', 'news-cell-button', 'remove', '✖'));
                    }
                    td.appendChild(cell);
                    td = td.nextElementSibling;
                    if (td === null) {
                        row = row.nextElementSibling;
                        if (row !== null)
                            td = row.firstElementChild;
                    }
                });
                if (currentConfiguration.currentFilter.author)
                    document.getElementById('name-filter').value = currentConfiguration.currentFilter.author;
                if (currentConfiguration.currentFilter.tags)
                    document.getElementById('tags-filter').value = currentConfiguration.currentFilter.tags;

                if (currentConfiguration.currentFilter.dateFrom)
                    document.getElementById('date-from-filter').value = dateToFilterFormat(currentConfiguration.currentFilter.dateFrom);
                if (currentConfiguration.currentFilter.dateTo)
                    document.getElementById('date-to-filter').value = dateToFilterFormat(currentConfiguration.currentFilter.dateTo);
                const paginationRow = document.getElementsByClassName('pagination')[0].firstElementChild.firstElementChild;
                while (paginationRow.firstElementChild !== null)
                    paginationRow.removeChild(paginationRow.firstElementChild);

                if (currentConfiguration.currentPage >= 3)
                    addElemToPagination(paginationRow, currentConfiguration.currentPage - 2, '...');
                if (currentConfiguration.currentPage >= 2)
                    addElemToPagination(paginationRow, currentConfiguration.currentPage - 1, currentConfiguration.currentPage - 1);
                addElemToPagination(paginationRow, currentConfiguration.currentPage, currentConfiguration.currentPage, true);
                if (currentConfiguration.currentPage <= currentNumOfPages - 1)
                    addElemToPagination(paginationRow, currentConfiguration.currentPage + 1, currentConfiguration.currentPage + 1);
                if (currentConfiguration.currentPage <= currentNumOfPages - 2)
                    addElemToPagination(paginationRow, currentConfiguration.currentPage + 2, '...');

            } else {
                const paginationRow = document.getElementsByClassName('pagination')[0].firstElementChild.firstElementChild;
                while (paginationRow.firstElementChild !== null)
                    paginationRow.removeChild(paginationRow.firstElementChild);
            }
        } else if (currentConfiguration.currentState === 'details') {
            const detailsDiv = document.getElementsByClassName('details-central')[0];
            detailsDiv.getElementsByClassName('details-container')[0].id = currentConfiguration.currentArticle.id;
            detailsDiv.getElementsByClassName('details-title')[0].innerHTML = currentConfiguration.currentArticle.title;
            detailsDiv.getElementsByClassName('details-author')[0].innerHTML = currentConfiguration.currentArticle.author;
            detailsDiv.getElementsByClassName('details-content')[0].innerHTML = currentConfiguration.currentArticle.content;
            let tagHTML = '';
            currentConfiguration.currentArticle.tags.forEach((tag) => {
                tagHTML = `${tagHTML} #${tag}`;
            });
            detailsDiv.getElementsByClassName('details-tags')[0].innerHTML = tagHTML;
            detailsDiv.getElementsByClassName('details-date')[0].innerHTML = dateToString(currentConfiguration.currentArticle.createdAt);
            if (currentConfiguration.currentUser !== '') {
                const authorAndButtons = detailsDiv.getElementsByClassName('details-author-and-buttons')[0];
                authorAndButtons.firstElementChild.firstElementChild.appendChild(makeElement('td', 'details-button', '', '<span class="details-button-text" id="edit">✎</span>'));
                authorAndButtons.firstElementChild.firstElementChild.appendChild(makeElement('td', 'details-button', '', '<span class="details-button-text" id="remove">✖</span>'));
            }
        } else if (currentConfiguration.currentState === 'edit') {
            document.getElementsByClassName('edit-top-right-col')[0].innerHTML = `ID: ${currentConfiguration.currentArticle.id}`;
            document.getElementsByClassName('edit-bot-left-col')[0].innerHTML = `${currentConfiguration.currentArticle.author}, ${dateToString(currentConfiguration.currentArticle.createdAt)}`;
            document.getElementById('title').value = currentConfiguration.currentArticle.title;
            document.getElementById('summary').value = currentConfiguration.currentArticle.summary;
            let tagsRow = document.getElementById('edit-tags-row');
            tagsRow.parentNode.removeChild(tagsRow);
            tagsRow = makeElement('tr', '', 'edit-tags-row', '');
            currentConfiguration.currentArticle.tags.forEach((tag) => {
                const newTag = document.querySelector('#template-edit-tag').content.querySelector('td').cloneNode(true);
                newTag.id = tag;
                newTag.querySelector('.tag-text').textContent = `#${tag}`;
                tagsRow.appendChild(newTag);
            });
            document.getElementsByClassName('edit-tags')[0].firstElementChild.appendChild(tagsRow);
            document.getElementById('content').value = currentConfiguration.currentArticle.content;
        } else if (currentConfiguration.currentState === 'add') {
            const newId = param;
            document.getElementsByClassName('edit-add-container')[0].id = newId;
            document.getElementsByClassName('edit-top-right-col')[0].innerHTML = `ID: ${newId}`;
            document.getElementsByClassName('edit-bot-left-col')[0].innerHTML = `${currentConfiguration.currentUser}, ${dateToString(new Date())}`;
        }
        setterOfListeners.setDynamicListeners();
    }

    return {
        currentConfiguration,
        init,
    };
}());
