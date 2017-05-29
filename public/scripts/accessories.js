accessories = (function () {

    function pointError(error) {
        if (error) {
            console.log('-----AN ERROR HAS HAPPENED-----');
            console.log(error);
        }
    }

    function articleParser(key, value) {
        if (key === 'createdAt')
            return new Date(value);
        return value;
    }

    function configParser(key, value) {
        if (key === 'createdAt' || key === 'dateFrom' || key === 'dateTo')
            return new Date(value);
        if (key === 'currentPage')
            return parseInt(value, 10);
        return value;
    }

    return {
        pointError,
        articleParser,
        configParser,
    };

}());