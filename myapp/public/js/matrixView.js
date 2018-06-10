function Matrix(options) {
    var margin = { top: 20, right: 30, bottom: 30, left: 20 },
      width = 220,
      height = 120,
      data = options.data,
      container = options.container,
      labelsData = options.labels,
      startColor = options.start_color,
      endColor = options.end_color;
    var widthLegend = 100;
    if (!data) {
      throw new Error("Please pass valumn matrix data");
    }
    if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) {
      throw new Error("It should be a 2-D array");
    }
  
    Promise.all([
      getCommunityMatrixData("data/CHIcommunityMatrix.json"),
      getCommunityMatrixData("data/CHIcommunityMatrixRandomSample.json"),
      getCommunityMatrixData("data/CHIcommunityMatrixSample.json")
    ]).then(function(values) {
      var maxValue = d3.max(values, function(each) {
        return d3.max(each, function(element) {
          return d3.max(element, function(d) {
            return d;
          });
        });
      });
  
      var minValue = d3.min(values, function(each) {
        return d3.min(each, function(element) {
          return d3.min(element, function(d) {
            return d;
          });
        });
      });
      var numrows = data.length;
      var numcols = data[0].length;
  
      d3
        .select(container)
        .select("svg")
        .remove();
      var svg = d3
        .select(container)
        .append("svg")
        .attr("width", 320)
        .attr("height", 160)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
      var background = svg
        .append("rect")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .attr("width", width)
        .attr("height", height);
  
      var x = d3.scale
        .ordinal()
        .domain(d3.range(numcols))
        .rangeBands([0, width]);
  
      var y = d3.scale
        .ordinal()
        .domain(d3.range(numrows))
        .rangeBands([0, height]);
  
      var colorMap = d3.scale
        .linear()
        .domain([minValue, maxValue])
        .range([0, 1]);
  
      var row = svg
        .selectAll(".row")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) {
          return "translate(0," + y(i) + ")";
        });
  
      var tip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
          return (
            "<span style='color:black'>" +
            d3.format(".2")(Math.pow(2, d)) +
            "</span>"
          );
        });
  
      var cell = row
        .selectAll(".cell")
        .data(function(d) {
          return d;
        })
        .enter()
        .append("g")
        .attr("class", "cell")
        .attr("transform", function(d, i) {
          return "translate(" + x(i) + ", 0)";
        })
        .call(tip)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
  
      cell
        .append("rect")
        .attr("width", x.rangeBand())
        .attr("height", y.rangeBand())
        .style("stroke-width", 0);
  
      row
        .selectAll(".cell")
        .data(function(d, i) {
          return data[i];
        })
        .style("fill", function(d, i) {
          return d3.interpolateYlGnBu(colorMap(d));
        });
  
      var labels = svg.append("g").attr("class", "labels");
  
      var columnLabels = labels
        .selectAll(".column-label")
        .data(labelsData)
        .enter()
        .append("g")
        .attr("class", "column-label")
        .attr("transform", function(d, i) {
          return "translate(" + x(i) + "," + height + ")";
        });
  
      columnLabels
        .append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", x.rangeBand() / 2)
        .attr("x2", x.rangeBand() / 2)
        .attr("y1", 0)
        .attr("y2", 5);
  
      columnLabels
        .append("text")
        .attr("x", 21)
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".62em")
        // .attr("font-size","1")
        .attr("text-anchor", "end")
        //.attr("transform", "rotate(-60)")
        .text(function(d, i) {
          return d;
        });
  
      var rowLabels = labels
        .selectAll(".row-label")
        .data(labelsData)
        .enter()
        .append("g")
        .attr("class", "row-label")
        .attr("transform", function(d, i) {
          return "translate(" + 0 + "," + y(i) + ")";
        });
  
      rowLabels
        .append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", 0)
        .attr("x2", -5)
        .attr("y1", y.rangeBand() / 2)
        .attr("y2", y.rangeBand() / 2);
  
      rowLabels
        .append("text")
        .attr("x", -8)
        .attr("y", y.rangeBand() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function(d, i) {
          return d;
        });
  
      var key = d3
        .select("#legend")
        .append("svg")
        .attr("width", widthLegend - 50)
        .attr("height", height + margin.top + margin.bottom);
  
      var legend = key
        .append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");
  
      legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.interpolateYlGnBu(1))
        .attr("stop-opacity", 1);
  
      legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.interpolateYlGnBu(0))
        .attr("stop-opacity", 1);
  
      key
        .append("rect")
        .attr("width", widthLegend / 2 - 10)
        .attr("height", height)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0," + margin.top + ")");
  
      var y = d3.scale
        .linear()
        .range([height, 0])
        .domain([minValue, maxValue]);
  
      var yAxis = d3.svg
        .axis()
        .scale(y)
        .orient("right");
  
      key
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(41," + margin.top + ")")
        .call(yAxis);
  
      var a = d3.interpolateYlGnBu(0);
      var b = d3.interpolateYlGnBu(1);
      var defs = svg.append("defs");
  
      var linearGradient = defs
        .append("linearGradient")
        .attr("id", "linearColor")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");
  
      var stop1 = linearGradient
        .append("stop")
        .attr("offset", "0%")
        .style("stop-color", a.toString());
  
      var stop2 = linearGradient
        .append("stop")
        .attr("offset", "100%")
        .style("stop-color", b.toString());
  
      var colorRect = svg
        .append("rect")
        .attr("x", 250)
        .attr("y", -1)
        .attr("width", 20)
        .attr("height", 123)
        .style("fill", "url(#" + linearGradient.attr("id") + ")");
  
      svg
        .append("text")
        .attr("x", 250)
        .attr("y", -1)
        .text(d3.format(".2")(Math.pow(2, maxValue)));
  
      svg
        .append("text")
        .attr("x", 271)
        .attr("y", 128)
        .text(minValue);
    });
  }