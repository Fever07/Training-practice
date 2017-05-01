articlesBaseService.init();

articlesBaseService.new_getArticles(0, 2, {
    'author': 'Иван Иванов',
}).then((result) => {
        let arr = JSON.parse(result, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
        });
        console.log(arr[1]);
        console.log(arr[0]);
    }, (error) => {
        console.log(error);
    });

const xhr = new XMLHttpRequest();
xhr.open('POST', '/login', true);
xhr.onload = function () {
    if (xhr.status === 200) {
        console.log(xhr.response);
    } else {
        const error = new Error(xhr.statusText);
        error.code = xhr.status;
        console.log(error);
    }
};
xhr.send({
    login: '',
    password: ''
});