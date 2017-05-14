accountsDatabase = (function () {
    var accounts = [
        {
            login: 'Vanvan',
            password: '123456',
            username: 'Иван Иванов',
        },
        {
            login: 'Nikoma',
            password: '1234567',
            username: 'Николай Малышев',
        },
        {
            login: 'Tanyusha',
            password: '777ppxx',
            username: 'Татьяна Терентьева',
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
        getAccount: getAccount,
    }

}());
