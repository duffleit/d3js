var labelHelper = function () {
    var labels = {
        "acc": "Acceleration",
        "cyl": "Cylinders",
        "ed": "Engine displacement",
        "hp": "Horsepower",
        "mpg": "Miles per gallon",
        "my": "Model Year",
        "name": "Name",
        "ori": "Origin",
        "weight": "Vehicle weight"
    };

    return {
        getProperty: function (propertyName) {
            return labels [propertyName]
        }
    }
}();