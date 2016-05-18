var tableService = function () {

    return {
        generate: function (table, dataset, labelHelper) {

            var keys = [];

            dataset.some(function (d) {
                keys = d3.keys(d);
                return true;
            });

            var headers = table.append("thead").append("tr")
                .selectAll("th")
                .data(keys)
                .enter()
                .append("th")
                .text(function (key) {
                    return labelHelper.getProperty(key);
                });

            var rows = table.append("tbody").selectAll("tr")
                .data(dataset)
                .enter()
                .append("tr");

            var cells = rows.selectAll("td")
                .data(function (row) {
                    return d3.values(row);
                })
                .enter()
                .append("td")
                .text(function (value) {
                    return value;
                });
        }
    }
}();