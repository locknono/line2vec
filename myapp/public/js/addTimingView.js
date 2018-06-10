function getTimingViewData(URL) {
  return new Promise(function(resolve, reject) {
    d3.json(URL, (error, data) => {
      resolve(data);
    });
  });
}
function addTimingView() {
  getTimingViewData("Data/All.json").then(function(data) {
    var margin = { top: 30, right: 10, bottom: 10, left: 10 },
      width = 1210 - margin.left - margin.right,
      height = 220 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
      y = {},
      dragging = {};

    var line = d3.svg.line().interpolate("monotone");
    var axis = d3.svg
      .axis()
      .tickSize(3)
      .outerTickSize(0)
      .orient("left");

    var background, foreground;

    var svg = d3
      .select("#timingView")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var track_arr = new Array(500);
    for (var i = 0; i < 500; i++) {
      track_arr[i] = data[0][i]["track"];
    }
    var dict = new Array();
    for (var i = 0; i < data[0].length; i++) {
      dict[data[0][i]["track"]] = i;
    }
    function get_matrix(track_arr) {
      matrix = new Array(24);
      for (var h = 0; h < matrix.length; h++) {
        matrix[h] = new Array(500);
        for (var j = 0; j < track_arr.length; j++) {
          matrix[h][j] = new Array(500);
          for (var k = 0; k < track_arr.length; k++) {
            if (data[h][dict[track_arr[j]]][track_arr[k]] == null)
              matrix[h][j][k] = 0;
            else matrix[h][j][k] = data[h][dict[track_arr[j]]][track_arr[k]];
          }
        }
      }
      return matrix;
    }
    matrix_arr = get_matrix(track_arr);
    var arr = new Array(24);
    for (var h = 0; h < 24; h++) {
      arr[h] = numeric.transpose(mds.classic(matrix_arr[h]));
    }
    axis_arr = new Array(500);
    max = 0;
    for (var i = 0; i < arr[0][0].length; i++) {
      axis_arr[i] = new Array();
      for (h = 0; h < 24; h++) {
        axis_arr[i][h] = Math.abs(arr[h][0][i]);
        if (max < axis_arr[i][h]) max = axis_arr[i][h];
      }
    }
    value_arr = new Array(5);
    for (var i = 0; i < 5; i++) {
      value_arr[i] = (i + 1) * max / 5;
    }
    console.log(axis_arr);

    console.log(data[0][0]["2-2"] == null);
    // console.log(track_arr);
    // function()

    // Extract the list of dimensions and create a scale for each.
    x.domain(
      (dimensions = d3.keys(axis_arr[0]).filter(function(d) {
        if (d == 17) {
          return (
            d != "name" &&
            (y[d] = d3.scale
              .linear()
              .domain(
                d3.extent(axis_arr, function(p) {
                  return +p[d];
                })
              )
              .range([0, height]))
          );
        } else {
          return (
            d != "name" &&
            (y[d] = d3.scale
              .linear()
              .domain(
                d3.extent(axis_arr, function(p) {
                  return +p[d];
                })
              )
              .range([height, 0]))
          );
        }
      }))
    );
    console.log(dimensions);
    // Add grey background lines for context.
    background = svg
      .append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(axis_arr)
      .enter()
      .append("path")
      .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg
      .append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(axis_arr)
      .enter()
      .append("path")
      .attr("d", path);
    /*
              .attr("click",function(){
                  d3.selectAll("path").attr("stroke","rgb(207, 206, 206)")
                  d3.select("this").attr("stroke","rgb(116, 138, 233)")
              });
    */

    // Add a group element for each dimension.
    var g = svg
      .selectAll(".dimension")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) {
        return "translate(" + x(d) + ")";
      })
      .call(
        d3.behavior
          .drag()
          .origin(function(d) {
            return { x: x(d) };
          })
          .on("dragstart", function(d) {
            dragging[d] = x(d);
            background.attr("visibility", "hidden");
          })
          .on("drag", function(d) {
            dragging[d] = Math.min(width, Math.max(0, d3.event.x));
            foreground.attr("d", path);
            dimensions.sort(function(a, b) {
              return position(a) - position(b);
            });
            x.domain(dimensions);
            g.attr("transform", function(d) {
              return "translate(" + position(d) + ")";
            });
          })
          .on("dragend", function(d) {
            delete dragging[d];
            transition(d3.select(this)).attr(
              "transform",
              "translate(" + x(d) + ")"
            );
            transition(foreground).attr("d", path);
            background
              .attr("d", path)
              .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
          })
      );
    // Add an axis and title.
    g
      .append("g")
      .attr("class", "axis")
      .each(function(d) {
        d3.select(this).call(axis.ticks(5).scale(y[d]));
      })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", 170)
      .text(function(d) {
        return d;
      });

    // Add and store a brush for each axis.
    g
      .append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(
          (y[d].brush = d3.svg
            .brush()
            .y(y[d])
            .on("brushstart", brushstart)
            .on("brush", brush))
        );
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

    function position(d) {
      var v = dragging[d];
      return v == null ? x(d) : v;
    }

    function transition(g) {
      return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
      return line(
        dimensions.map(function(p) {
          return [position(p), y[p](d[p])];
        })
      );
    }

    function brushstart() {
      d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      var actives = dimensions.filter(function(p) {
          return !y[p].brush.empty();
        }),
        extents = actives.map(function(p) {
          return y[p].brush.extent();
        });
      foreground.style("display", function(d) {
        return actives.every(function(p, i) {
          return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        })
          ? null
          : "none";
      });
    }
  });
}

// addTimingView();
