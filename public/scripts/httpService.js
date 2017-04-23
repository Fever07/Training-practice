httpService = (function () {
    function makeRequest(method, url, req) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            if (method === 'POST')
                xhr.setRequestHeader('content-type', 'application/json');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    const error = new Error(xhr.statusText);
                    error.code = xhr.status;
                    reject(error);
                }
            };
            xhr.onerror = function () {
                reject(new Error('Network Error'));
            };
            xhr.send(req);
        });
    }

    return {
        makeRequest,
    };

}());
