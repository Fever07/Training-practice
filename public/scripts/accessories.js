accessories = (function () {

    function pointError(error) {
        if (error) {
            console.log('-----AN ERROR HAS HAPPENED-----');
            console.log(error);
        }
    }

    return {
        pointError,
    };

}());