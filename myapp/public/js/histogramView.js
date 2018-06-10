//add Edge Betweenness histogram view
function addHistogram(file) {
  getEbData(file).then(function(intervalData) {
    var hisSvg = d3.select("#hisSvg");
    hisSvg.selectAll("g").remove();
    var hisMargin = { top: 20, right: 25, bottom: 20, left: 25 },
      width = 290 - hisMargin.left - hisMargin.right,
      height = 220 - hisMargin.top - hisMargin.bottom;

    var y = d3.scaleLinear().rangeRound([height, 0]);

    var x = d3.scaleLinear().range([0, width]);

    var x2 = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(intervalData, function(d) {
          return d.max;
        })
      ])
      .range([0, width]);

    var tip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return (
          "<span style='color:black'>" +
          d3.format(".4")(d.frequency) +
          "</span>"
        );
      });

    var g = hisSvg
      .append("g")
      .attr(
        "transform",
        "translate(" + hisMargin.left + "," + hisMargin.top + ")"
      )
      .call(tip);

    x.domain([0, intervalData.length]);
    y.domain([
      d3.min(intervalData, function(d) {
        return d.frequency;
      }),
      d3.max(intervalData, function(d) {
        return d.frequency;
      })
    ]);

    g
      .selectAll(".bar")
      .data(intervalData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {
        return x(i);
      })
      .attr("width", function(d, i) {
        return x(i + 1) - x(i);
      })
      .attr("y", function(d) {
        return y(d.frequency);
      })
      .attr("height", function(d) {
        return height - y(d.frequency);
      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", function() {
        return "translate(0," + height + ")";
      })
      .call(d3.axisBottom(x2).ticks(5));

    g
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(5));

    g
      .append("text")
      .attr("transform", "translate(5,-20)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Freq");

    g
      .append("text")
      .attr("transform", "translate(" + (width + 3) + "," + (height - 10) + ")")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "start")
      .text("EB");
    //add Edge Betweenness histogram view
  });
}

function addHistogram2(fileName) {
  var svg = d3.select("#hisSvg");
  svg.selectAll("g").remove();
  var margin = { top: 15, right: 20, bottom: 20, left: 20 };
  var width =
    +document.getElementById("hisSvg").getAttribute("width") -
    margin.left -
    margin.right;
  var height =
    +document.getElementById("hisSvg").getAttribute("height") -
    margin.top -
    margin.bottom;

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //////console.log(width);
  var x0 = d3
    .scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.2);

  var x1 = d3.scaleBand().padding(0.05);

  var y = d3.scaleLinear().rangeRound([height, 0]);

  d3.interpolateYlGnBu;
  var z = d3.scaleOrdinal().range(["#0D9DFF", "#E8E60C"]);

  d3.csv(
    fileName,
    function(d, i, columns) {
      for (var i = 1, n = columns.length; i < n; ++i)
        d[columns[i]] = parseFloat(Math.log2(d[columns[i]] + 1));
      return d;
    },
    function(error, data) {
      if (error) throw error;

      var keys = data.columns.slice(1);

      x0.domain(
        data.map(function(d, i) {
          return d.State;
        })
      );
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y
        .domain([
          0,
          d3.max(data, function(d) {
            return d3.max(keys, function(key) {
              return d[key];
            });
          })
        ])
        .nice();
      g
        .append("text")
        .attr(
          "transform",
          "translate(" + (width + 3) + "," + (height - 10) + ")"
        )
        .attr("y", 6)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("font-size","8px")
        .text("EB");

      g
        .append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d) {
          return "translate(" + x0(d.State) + ",0)";
        })
        .selectAll("rect")
        .data(function(d) {
          return keys.map(function(key) {
            return { key: key, value: d[key] };
          });
        })
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return x1(d.key);
        })
        .attr("y", function(d) {
          return y(d.value);
        })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) {
          return height - y(d.value);
        })
        .attr("fill", function(d) {
          return z(d.key);
        });

      g
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

      g
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", -5)
        .attr("y", y(y.ticks().pop()) - 6)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Freq");

      var legend = g
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice())
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
          return "translate(0," + (i * 12 - 7) + ")";
        });

      legend
        .append("rect")
        .attr("x", width)
        .attr("width", 11)
        .attr("height", 10)
        .attr("fill", z);

      legend
        .append("text")
        .attr("x", width - 5)
        .attr("y", 6.5)
        .attr("dy", "0.32em")
        .text(function(d) {
          return d;
        });
    }
  );
}
