var csvLoader = function () {

    return {
        load: function (parameters) {
            var dsv = d3.dsv(";", "text/plain");

            var float = function (value) {
                return isNaN(parseFloat(value)) ? 0 : parseFloat(value.replace(",", "."));
            }

            dsv(parameters.file,
                function (row) {
                    var countryOfOrigin = parameters.countryHelper.getCountryByIdentifier(float(row.Origin));

                    var currentYear = float(new Date().getFullYear().toString().substring(2));

                    var year = float(row['Model year']) < currentYear
                        ? float("20" + float(row['Model year']))
                        : float("19" + float(row['Model year']))

                    return {
                        "acc": float(row.Acceleration),
                        "cyl": float(row.Cylinders),
                        "ed": float(row['Engine displacement']),
                        "hp": float(row.Horsepower),
                        "mpg": float(row['Miles per gallon']),
                        "my": year,
                        "name": row.Name,
                        "ori": countryOfOrigin,
                        "weight": float(row['Vehicle weight']),
                    }
                },
                function (error, dataset) {

                    if (error !== null) {
                        console.log("error: " + error);
                        parameters.error(error);
                    }

                    parameters.success(dataset);
                }
            );
        }
    }
}();