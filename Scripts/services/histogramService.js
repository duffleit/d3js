var histogramService = function () {

    var size = { width: 600, height: 600, margin: 30};
    var initValues = { dataSet: [], div: null };

    var createHistogram = function(histogramDiv, dataset){

        var data = d3.layout.histogram().value(function(data){return data.my;});

        var boundaries = {
            xMin: d3.min(dataset, function(data){return data.my;}) - 0.5,
            xMax: d3.max(dataset, function(data){return data.my;}) + 0.5,
            yMin: 0,
            yMax: function(){
                var frequency = [];
                for(var n in dataset) {
                    frequency[dataset[n].my]=(frequency[dataset[n].my] || 0)+1; // increment frequency.
                }
                return d3.max(frequency);
            }()
        };

        var xScale = d3.scale.linear().range([0, size.width - size.margin * 2]).domain([boundaries.xMin, boundaries.xMax]);
        var yScale = d3.scale.linear().range([size.height - size.margin * 2, 0]).domain([boundaries.yMin, boundaries.yMax]);
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("d"));
        var yAxis = d3.svg.axis().scale(yScale).orient("left");

        var yearRange = d3.range(d3.min(dataset, function(data){return data.my;}), d3.max(dataset, function(data){return data.my;}) + 2);
        data.bins(yearRange);

        data = data(dataset);

        var svg = histogramDiv.append("svg")
            .attr("width", size.width)
            .attr("height", size.height)
            .append("g")
            .attr("transform", "translate(" + size.margin + "," + size.margin + ")");

        var bar = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar")
            .attr("transform", function (bin) {
                return "translate(" + xScale(bin.x) + "," + yScale(bin.y) + ")";
            });

        rects = bar.append("rect")
            .attr("class", "histogram-bar")
            .attr("x", function() {
                return Math.floor((xScale(data[0].x) - xScale(data[0].x + data[0].dx))/2);
            })
            .attr("width", function(){
                return Math.floor(xScale(data[0].x + data[0].dx) - xScale(data[0].x));
            })
            .attr("height", function(d) { return size.height - size.margin * 2 - yScale(d.y); });

        //value of bar
        bar.append("text")
            .attr("y", 15)
            .attr("foreground", "white")
            .attr("text-anchor", "middle")
            .text(function(d) { return (d.y > 0) ? d.y : ""; });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (size.height - size.margin * 2) + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", size.width - size.margin * 2 - 10)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("Year");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", size.margin - 20)
            .attr("x", -10)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Count");
    };

    return {
        generate: function (histogram, dataset) {
            initValues = { dataSet: dataset, div: histogram };
            createHistogram(histogram, dataset);
        },
        onElementSelectionChanged: function(cb){
            initValues.div.select("*").remove();
            var selectedCars = initValues.dataSet.filter(function(car) { return car.selected});

            if(selectedCars.length < 1){
                createHistogram(initValues.div, initValues.dataSet);
            }
            else{
                createHistogram(initValues.div, selectedCars);
            }
        }
    }
}();