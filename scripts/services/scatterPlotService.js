var scatterPlotService = function () {

    return {
        generate: function (scatterPlot, dataset, countryHelper) {

            var w = 1500;
            var h = 600;
            var padding = 30;
            
            var xScale = d3.scale.linear()
                .domain([d3.min(dataset, function (d) {
                    return d.acc;
                }), d3.max(dataset, function (d) {
                    return d.acc;
                })])
                .range([padding, w - padding * 2]);

            var yScale = d3.scale.linear()
                .domain([d3.min(dataset, function (d) {
                    return d.mpg;
                }), d3.max(dataset, function (d) {
                    return d.mpg;
                })])
                .range([h - padding, padding]);

            var categoryScale = d3.scale.category10();

            var svg = scatterPlot.append("svg").attr("width", w).attr("height", h);
            var tooltip = scatterPlot.append("div").attr("class", "tooltip").style("opacity", 0);

            //insert circles
            svg.selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return xScale(d.acc);
                })
                .attr("cy", function (d) {
                    return yScale(d.mpg);
                })
                .attr("r", function (d) {
                    return 5;
                })
                .attr("fill", function (d) {
                    return categoryScale(d.ori)
                })
                .on("mouseover", function (d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                    tooltip.html("<b>" + d.name +
                            "</b><br/>Acceleration: " + d.acc +
                            "<br/>Miles per gallon: " + d.mpg +
                            "<br/>Origin: " + d.ori)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            //add x-Axis label
            svg.append("text")
                .text("Acceleration")
                .attr("text-anchor", "end")
                .attr("transform", "translate(" + (w - padding * 2) + "," + (h - padding - 5) + ")")

            //add y-Axis label
            svg.append("text")
                .text("Miles per gallon")
                .attr("text-anchor", "end")
                .attr("transform", "translate(" + (padding + 15) + "," + padding + ")rotate(270)")

            //add x-Axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(d3.svg.axis().scale(xScale).orient("bottom"));

            //add y-Axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(d3.svg.axis().scale(yScale).orient("left"));

            //add legend
            svg
                .append("foreignObject")
                .attr("transform", "translate(0," + padding + ")")
                .attr("height", "100")
                .attr("width", w - (padding * 2))
                .append('xhtml:div')
                .selectAll('div')
                .data(countryHelper.getAvailableCountries)
                .enter()
                .append('div')
                .attr("class", "legendItem")
                .html(function (d) {
                    return d;
                })
                .style("border-color", categoryScale)
        }
    }
}();