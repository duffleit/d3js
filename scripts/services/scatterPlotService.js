var scatterPlotService = function () {

    return {
        generate: function (scatterPlot, dataset, onSelectionChangedCallbacks, countryHelper) {

            var margin = 25;
            var size = { width: 900, height: 600};

            var xScale = d3.scale.linear()
                .domain([d3.min(dataset, function (d) {
                    return d.acc;
                }), d3.max(dataset, function (d) {
                    return d.acc;
                })])
                .range([margin, size.width - margin * 2]);

            var yScale = d3.scale.linear()
                .domain([d3.min(dataset, function (d) {
                    return d.mpg;
                }), d3.max(dataset, function (d) {
                    return d.mpg;
                })])
                .range([size.height - margin, margin]);

            var categoryScale = d3.scale.category10();

            var svg = scatterPlot.append("svg").attr("width", size.width).attr("height", size.height);
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
                .attr("transform", "translate(" + (size.width - margin * 2) + "," + (size.height - margin - 5) + ")")

            //add y-Axis label
            svg.append("text")
                .text("Miles per gallon")
                .attr("text-anchor", "end")
                .attr("transform", "translate(" + (margin + 15) + "," + margin + ")rotate(270)")

            //add x-Axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (size.height - margin) + ")")
                .call(d3.svg.axis().scale(xScale).orient("bottom"));

            //add y-Axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + margin + ",0)")
                .call(d3.svg.axis().scale(yScale).orient("left"));

            //add legend
            svg
                .append("foreignObject")
                .attr("transform", "translate(0," + margin + ")")
                .attr("height", "100")
                .attr("width", size.width - (margin * 2))
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


            var onBrushMove = function(){

                brushArea = brush.extent();

                var brushCoordinates = {
                    x1: brushArea[0][0],
                    y1: brushArea[0][1],
                    x2: brushArea[1][0],
                    y2: brushArea[1][1]
                };

                svg.selectAll("circle").classed("out-of-brush", function (car) {
                    car.selected = false;
                    return false;
                });

                svg.selectAll("circle").classed("out-of-brush", function (car) {

                    var x = car.acc || 0;
                    var y = car.mpg || 0;

                    var con = x >= brushCoordinates.x1 && y >= brushCoordinates.y1 && x <= brushCoordinates.x2 && y <= brushCoordinates.y2;

                    if(con) car.selected = true;
                    return !con;
                });

                for(var i = 0; i < onSelectionChangedCallbacks.length; i++){
                    onSelectionChangedCallbacks[i]();
                }
            };

            var brush = d3.svg.brush()
                        .x(xScale)
                        .y(yScale)
                        .on("brush", onBrushMove)

            svg
                .append('g')
                .call(brush);

        }
    }
}();