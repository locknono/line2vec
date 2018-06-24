function drawMDS_PCP(selectedMapLines) {
  
  var width_mds = 280,
    height_mds = 160;
  d3
    .select("#weekMDS")
    .select("svg")
    .remove();
  d3
    .select("#weekPCP")
    .select("svg")
    .remove();
  var svg_mds = d3
    .select("#weekMDS")
    .append("svg")
    .attr("width", width_mds)
    .attr("height", height_mds);
  svg_mds.selectAll("#points").remove();
  svg_mds.selectAll("g").remove();
  svg_mds.selectAll("rect").remove();




  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
  d3.json("data/All.json", function(data) {
    

    // d3.csv("cars.csv", function(error, cars) {
    //Json文件数据处理
    /*  
    var track_arr = new Array(200);
    for (var i = 0; i < 200; i++) {
      track_arr[i] = data[0][i]["Track"];
    }
    */
    track_arr = getSitesName(selectedMapLines);
    
    var dict = {};
    
    for (var i = 0; i < data[0].length; i++) {
      dict[data[0][i]["Track"]] = i;
    }
    
    
    

    function get_matrix(track_arr) {
      matrix = new Array(4);
      for (var h = 0; h < matrix.length; h++) {
        matrix[h] = new Array(track_arr.length);
        for (var j = 0; j < track_arr.length; j++) {
          matrix[h][j] = new Array(track_arr.length);
          matrix[h][j]["Track"] = data[h][dict[track_arr[j]]]["Track"];
          for (var k = 0; k < track_arr.length; k++) {
            if (data[h][dict[track_arr[j]]][track_arr[k]] == null)
              matrix[h][j][k] = 1;
            else
              matrix[h][j][k] = 1 / data[h][dict[track_arr[j]]][track_arr[k]];
          }
        }
      }
      return matrix;
    }
    matrix_arr = get_matrix(track_arr);
    
    var arr = new Array(4);
    for (var h = 0; h < 4; h++) {
      arr[h] = numeric.transpose(mds.classic(matrix_arr[h]));
    }
    axis_arr = new Array(track_arr.length);
    max = 0;
    for (var i = 0; i < arr[0][0].length; i++) {
      axis_arr[i] = new Array();
      for (h = 0; h < 4; h++) {
        axis_arr[i][h] = Math.abs(arr[h][0][i]);
        if (max < axis_arr[i][h]) max = axis_arr[i][h];
      }
    }
    
    value_arr = new Array(5);
    for (var i = 0; i < 5; i++) {
      value_arr[i] = (i + 1) * max / 5;
    }
    
    var mds_matrix = new Array(track_arr.length);
    for (var i = 0; i < track_arr.length; i++) {
      mds_matrix[i] = new Array(track_arr.length);
      for (var j = 0; j < track_arr.length; j++) {
        mds_matrix[i][j] = 0;
        for (var k = 0; k < 4; k++)
          mds_matrix[i][j] += Math.pow(axis_arr[i][k] - axis_arr[j][k], 2);
        mds_matrix[i][j] = Math.sqrt(mds_matrix[i][j]);
      }
    }
    

    var mds_arr = mds.classic(mds_matrix, 2);
    var maxMdsX = (maxMdsY = -10),
      minMdsX = (minMdsY = 10);
    for (var i = 0; i < mds_arr.length; i++) {
      maxMdsX = maxMdsX < mds_arr[i][0] ? mds_arr[i][0] : maxMdsX;
      maxMdsY = maxMdsY < mds_arr[i][1] ? mds_arr[i][1] : maxMdsY;
      minMdsX = minMdsX > mds_arr[i][0] ? mds_arr[i][0] : minMdsX;
      minMdsY = minMdsY > mds_arr[i][1] ? mds_arr[i][1] : minMdsY;
    }
    var norMdsX = maxMdsX - minMdsX,
      norMdsY = maxMdsX - minMdsY;
    
    svg_points = svg_mds
      .selectAll("#points")
      .data(mds_arr)
      .enter()
      .append("circle")
      .attr("id", function(d, i) {
        return "#" + matrix_arr[0][i]["Track"];
      })
      .attr("cx", function(d) {
        return (d[0] - minMdsX) / norMdsX * 150;
      })
      .attr("cy", function(d) {
        return (d[1] - minMdsY) / norMdsY * 150 + 5;
      })
      .attr("r", 3)
      .attr("color", "#000")
      .attr("opacity", ".4")
      .attr("transform", "translate(120,0)");
    for (var i = 0; i < mds_arr.length; i++) {
      mds_arr[i].name = matrix_arr[0][i]["Track"];
    }
    
    nodes = HclusterYear(mds_arr);

    

    var rectMargin = {
      top: 5,
      bottom: 5,
      left: 5,
      right: 5
    };
    var rectX = rectMargin.left;
    var rectHeight =
      (160 - rectMargin.top - rectMargin.bottom) / (nodes[0].length + 1);

    //add brush function
    var index = 0;
    svg_mds
      .append("g")
      .attr("class", "brush")
      .style("z-index", "3")
      .call(
        d3
          .brushY()
          .extent([
            [rectMargin.top, rectMargin.left],
            [125, 160 - rectMargin.bottom]
          ])
          .on("brush", brushed)
          .on("end", brushRectEnd)
      );
    svg_mds.selectAll(".selection").style("z-index", 100);

    function brushed() {}

    var mapLines = [];
    function brushRectEnd() {
      mapLines=[];
      var brushRectLineArray = [];
      
      
      
      var rectNumber = parseInt(
        (d3.event.selection[1] - d3.event.selection[0]) / rectHeight
      );
      
      var startIndex = parseInt((d3.event.selection[0] - 5) / rectHeight);
      
      if (rectNumber > nodes[index].length) {
        rectNumber = nodes[index].length;
      }
      
      for (var j = startIndex; j < startIndex + rectNumber; j++) {
        
        for (var s = 0; s < nodes[index][j].length; s++) {
          
          brushRectLineArray.push(nodes[index][j][s].name);
        }
      }
      

      for (var i = 0; i < brushRectLineArray.length; i++) {
        for (var j = 0; j < selectedMapLines.length; j++) {
          let source = brushRectLineArray[i].split("-")[0];
          let target = brushRectLineArray[i].split("-")[1];
          if (
            source == selectedMapLines[i].source &&
            target == selectedMapLines[i].target
          ) {
            mapLines.push(selectedMapLines[i]);

            continue;
          }
        }
      }
      
    }

    //add initial rects
    var maxLength = 0;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < nodes[i].length; j++) {
        if (nodes[i][j].length > maxLength) {
          maxLength = nodes[i][j].length;
        }
      }
    }
    
    var gRect = svg_mds.append("g").attr("class", "rect");
    var rectWidthScale = d3
      .scaleLinear()
      .domain([0, maxLength])
      .range([10, 120]);
    for (var i = 0; i < nodes[0].length; i++) {
      gRect
        .append("rect")
        .attr("x", rectX)
        .attr("y", rectMargin.top + rectHeight * i)
        .attr("width", rectWidthScale(nodes[0][i].length))
        .attr("height", rectHeight)
        .attr("fill", "#1649a4")
        .attr("stroke", "black");
    }

    //add slider funtion
    $("#rectSlider").slider({
      min: 0,
      max: nodes.length - 1,
      step: 1,
      value: 0,
      // value:[0,100],
      slide: function(event, ui) {
        index = ui.value;
        rectNumber = nodes[index].length;
        gRect.selectAll("rect").remove();

        for (var i = 0; i < rectNumber; i++) {
          gRect
            .append("rect")
            .attr("x", rectX)
            .attr("y", rectMargin.top + rectHeight * i)
            .attr("width", rectWidthScale(nodes[index][i].length))
            .attr("height", rectHeight)
            .attr("fill", "#1649a4")
            .attr("stroke", "black");
        }
      },
      stop: function(event, ui) {}
    });

    function HclusterYear(data,threshold) {
      var hclusterdata = new Array();
      var cluster = d3.layout.cluster();
      for (var i = 0; i < data.length; i++) {
        hclusterdata[i] = {
          position: [],
          name: data[i].name
        };
        hclusterdata[i].position.push(data[i][0], data[i][1]);
      }
      var dataset = hcluster()
        .distance("euclidean")
        .linkage("avg")
        .data(
          hclusterdata.sort(function(a, b) {
            return Math.random() - 0.5;
          })
        );
      var maxDis = maxDistance(dataset.tree());
      var hcdata = new Array();
      var nodes = new Array();
      for (var i = 0; i <= 10; i++) {
        var threshold = i / 10 * maxDis;
        hcdata[i] = cut(dataset.tree(), threshold);
        nodes[i] = new Array();
        for (var j = 0; j < hcdata[i].length; j++) {
          var hcdata_nodes = cluster.nodes(hcdata[i][j]);
          nodes[i][j] = {};
          nodes[i][j] = new Array();
          var l = 0;
          for (var k = 0; k < hcdata_nodes.length; k++) {
            if (hcdata_nodes[k].children) {
            } else {
              nodes[i][j][l] = {};
              nodes[i][j][l].name = hcdata_nodes[k].name;
              nodes[i][j][l] = hcdata_nodes[k];
              l++;
            }
          }
          nodes[i][j].length = l;
        }
      }
      return nodes;
    }
    //
    // 
    // function()




    var margin = {
      top: 10,
      right: 5,
      bottom: 15,
      left: 5
    },
    width = 540 - 120 - margin.left - margin.right,
    height = 160 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

  var line = d3.svg.line().interpolate("basis");
  var background, foreground;





  var axis = d3.svg
    .axis()
    .tickSize(3)
    .outerTickSize(0)
    .orient("left");
    var svg = d3
    .select("#weekPCP")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("position", "absolute")
    .style("right", "0px")
    .append("g")
    .attr("transform", "translate(5,10)");
    svg.selectAll(".dimension").remove();
    svg.selectAll("path").remove();

    //add parallel coordinates
    // Extract the list of dimensions and create a scale for each.
    
    

    x.domain(
      (dimensions = d3.keys(axis_arr[0]).filter(function(d) {
        if (d == 14) {
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
      .attr("id", function(d, i) {
        return "#" + matrix_arr[0][i]["Track"];
      })
      .attr("d", path);

    /*
        .attr("click",function(){
            d3.selectAll("path").attr("stroke","rgb(204, 206, 206)")
            d3.select("this").attr("stroke","rgb(116, 138, 233)")
        });*/

    // Add a group element for each dimension.
    var g = svg
      .selectAll(".dimension")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) {
        "translate(" + x(d) + ")";
      });


      var min=d3.min(axis_arr,function(d){
        return d3.min(axis_arr);
      })
      var max=d3.max(axis_arr,function(d){
        return d3.max(axis_arr);
      })
      
      
    
      var yAxisSacle=d3.scaleLinear()
      .domain([min,max])
      .range([height,0]);
      
      var yAxis=d3.axisLeft()
      g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,30)")
      .call(axis);

     g
      .append("g")
      .attr("class", "axis")
      .each(function(d) {
        
        
        d3.select(this).call(axis.ticks(5).scale(y[d]));
      })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", 150)
      .text(function(d) {
        return d;
      });
      

    // Add and store a brush for each axis.
    /* g
       .append("g")
       .attr("class", "brush")
       .each(function (d) {
         d3.select(this).call(
           (y[d].brush = d3.svg
             .brush()
             .y(y[d])
             .on("brushstart", brushstart)
             .on("brush", brush))
           .on("end", brushended)
         );
       })
       .selectAll("rect")
       .attr("x", -8)
       .attr("width", 16);
       */
    //});


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

    
  });

  function maxDistance(data) {
    var list = [data];
    var ans = [];
    var maxDis = 0;
    while (list.length > 0) {
      var aux = list.shift();
      if (aux.height > maxDis) maxDis = aux.height;
    }
    return maxDis;
  }

  function cut(data, threshold) {
    if (threshold < 0) throw new Error("Threshold too small");
    var list = [data];
    var ans = [];
    while (list.length > 0) {
      var aux = list.shift();
      if (threshold >= aux.height) ans.push(aux);
      else list = list.concat(aux.children);
    }
    return ans;
  }

  //return mapLines;
}

function getSitesName(selectedMapLines) {
  var sites = [];
  for (var i = 0; i < selectedMapLines.length; i++) {
    name = selectedMapLines[i].source + "-" + selectedMapLines[i].target;
    sites.push(name);
  }
  return sites;
}
