var countryHelper = function () {
    return {
        getAvailableCountries: function () {
            return ["USA", "Europe", "Japan"]
        },
        getCountryByIdentifier: function (identifier) {
            return this.getAvailableCountries()[identifier - 1];
        }
    }
}();