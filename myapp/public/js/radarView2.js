function getSumVolumeData(volumeData) {

  var sumVolumeData = [];
  var arrayLength = volumeData[0].value.length;
  for (var i = 0; i < arrayLength; i++) {
    sumVolumeData[i] = 0;
  }
  for (var i = 0; i < volumeData.length; i++) {
    for (var j = 0; j < arrayLength; j++) {
      sumVolumeData[j] += volumeData[i].value[j];
    }
  }
  return sumVolumeData;
}

function getSelectedData(selectedMapData, data) {
  var selectedMapLines = [];
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < selectedMapData.length; j++) {
      if (data[i].source != selectedMapData[j].stationID) {
        continue;
      }
      for (var s = 0; s < selectedMapData.length; s++) {
        if (data[i].target == selectedMapData[s].stationID) {
          selectedMapLines.push(data[i]);
        }
      }
    }
  }
  return selectedMapLines;
}
function getEachRadarData(selectedMapLines,Tc_p) {
  return new Promise(function(resolve, reject) {
    baseshowflux2(getSitesName(selectedMapLines)).then(function(volumeData) {
      if (volumeData.length === 0) {return;}
      changeVolumeArray(volumeData);
      var sumVolumeData = getSumVolumeData(volumeData);      
      var flowAccount = selectedMapLines.length;
      var crossovers = 0;
      var intersanctionArray = [];
      for (var i = 0; i < selectedMapLines.length; i++) {
        intersanctionArray[i] = [];
        for (var j = 0; j < selectedMapLines.length; j++) {
          intersanctionArray[i][j] = 0;
        }
      }
      for (var i = 0; i < selectedMapLines.length; i++) {
        for (var j = 0; j < selectedMapLines.length; j++) {
          var tcl = selectedMapLines[i];
          if (i == j) continue;
          if (crossTC(tcl.scor,tcl.tcor,tcl.scor,tcl.tcor)){
            intersanctionArray[i][j]++;
            crossovers++;
          }
        }
      }
      var avgIntersaction = crossovers / selectedMapLines.length;
      var maxIntersantion = d3.max(intersanctionArray, function(d) {return d3.max(d);});
      //console.log("avgIntersaction: ", avgIntersaction);
      //console.log("maxIntersantion: ", maxIntersantion);
      ////console.log("intersanctionArray: ", intersanctionArray);
      ////console.log("sumVolumeData: ", sumVolumeData);

      //ebt
      var Tc_sum_ebt = 0;
      var maxEbt = -1;
      for (var i = 0; i < selectedMapLines.length; i++) {
        Tc_sum_ebt += selectedMapLines[i].ebt;
        maxEbt = maxEbt > selectedMapLines[i].ebt ? maxEbt : selectedMapLines[i].ebt;
      }
      var avgEbt = Tc_sum_ebt / selectedMapLines.length;
      //console.log("avgEbt",avgEbt);
      //console.log("maxEbt",maxEbt);

      var Tc_center =[0,0];
      for (var i = 0; i < selectedMapLines.length; i++) {
        Tc_center[0] += selectedMapLines[i].x;
        Tc_center[1] += selectedMapLines[i].y;
      }
      Tc_center[0] /= selectedMapLines.length;
      Tc_center[1] /= selectedMapLines.length;
      var Tc_dis = 0;
      for (var i = 0; i < selectedMapLines.length; i++) {
        var px = selectedMapLines[i].x,     py = selectedMapLines[i].y;
        Tc_dis += Math.sqrt(Math.pow((px-Tc_center[0]),2) + Math.pow((py-Tc_center[1]),2));
      }
      Tc_dis /= selectedMapLines.length;
      var tran = Math.sqrt(Math.pow((Tc_center[0]-Tc_p[0]),2) + Math.pow((Tc_center[1]-Tc_p[1]),2));
      //console.log("center-transform",tran);
      //console.log("dis",Tc_dis);
      
      var variance = d3.variance(sumVolumeData);
      ////console.log("variance: ", variance);
      var maxFlow = d3.max(sumVolumeData);
      ////console.log("maxFlow: ", maxFlow);
      var avgFlow = d3.sum(sumVolumeData) / selectedMapLines.length;
      ////console.log("avgFlow: ", avgFlow);
      var minFlow = d3.min(sumVolumeData);
      ////console.log("minFlow: ", minFlow);
      var lineNumber = selectedMapLines.length;
      ////console.log("volumeData.length", volumeData.length);
      ////console.log("lineNumber: ", lineNumber);
      var commNumber = 0;
      var labelArray = [];
      for (var i = 0; i < selectedMapLines.length; i++) {
        if ($.inArray(selectedMapLines[i].label, labelArray) == -1) {
          labelArray.push(selectedMapLines[i].label);
          commNumber++;
        }
      }
      ////console.log("commNumber: ", commNumber);
      var edgebtw = 0;
      for (var i = 0; i < selectedMapLines.length; i++) {
        edgebtw += selectedMapLines[i].ebt;
      }
      ////console.log("selectedMapLines", selectedMapLines);
      ////console.log("edgebtw: ", edgebtw);
      ////console.log("crossovers: ", crossovers);
      var data = [
        lineNumber,
        crossovers,
        commNumber,
        edgebtw,
        minFlow,
        variance,
        maxFlow,
        avgFlow
      ];
      ////////console.log("eachData", data);
      ///  传一个最大线的长度
      var Tc_data = [
        lineNumber,
        avgIntersaction,
        maxIntersantion,
        avgEbt,
        maxEbt,
        tran,
        Tc_dis,
        1
      ]
      resolve(Tc_data);
    });
  });
}

function getCenter(Line){
  var Tc_center = [0,0];
      for (var i = 0; i < Line.length; i++) {
        Tc_center[0] += Line[i].x;
        Tc_center[1] += Line[i].y;
      }
      Tc_center[0] /= Line.length;
      Tc_center[1] /= Line.length;
  return Tc_center;
}

function getRadarData(
  selectedMapData,
  scatterData,
  sampledScatterData,
  volumeData
) {
  oLines = getSelectedData(selectedMapData, scatterData);
  ////////console.log("oLines: ", oLines);
  sLines = getSelectedData(selectedMapData, sampledScatterData);
  ////////console.log("sLines: ", sLines);
  var p = getCenter(oLines);
  var data = [];
  Promise.all([getEachRadarData(oLines,p), getEachRadarData(sLines,p)]).then(
    function(values) {
      ////console.log("RADAR DATA", values);
      var maxArray = [];
      for (var j = 0; j < 8; j++) {
        maxArray.push(d3.max([values[0][j], values[1][j]]));
      }
      var minArray = [];
      for (var j = 0; j < 8; j++) {
        minArray.push(d3.min([values[0][j], values[1][j]]));
      }
      ////console.log("maxArray: ", maxArray);
      ////console.log("minArray: ", minArray);
      getRadarRadius(values, minArray, maxArray);
      return values;
    }
  );
}

function getRadarRadius(data, minArray, maxArray) {
  ////////console.log("maxArray: ", maxArray);
  ////////console.log("minArray: ", minArray);
  ////////console.log("data: ", data);
  var scaleArray = [];
  for (var i = 0; i < 8; i++) {
    var linear = d3
      .scaleLinear()
      .domain([minArray[i], maxArray[i]])
      .range([40, 120]);
    scaleArray.push(linear);
  }
  var allRadiusArray = [];
  for (var i = 0; i < 2; i++) {
    var radius = [];
    for (var j = 0; j < 8; j++) {
      radius.push(scaleArray[j](data[i][j]));
    }
    allRadiusArray.push(radius);
  }
  ////////console.log("allRadiusArray: ", allRadiusArray);
  addRadarView(allRadiusArray, data);
}

function directTC(o, p, q) {
  cd1 = (q[0] - o[0]) * (p[1] - o[1]);
  cd2 = (p[0] - o[0]) * (q[1] - o[1]);
  return cd1 - cd2;
}
function onLineSegmentTC(o, p, q) {
  minx = o[0] < p[0] ? o[0] : p[0];
  maxx = o[0] > p[0] ? o[0] : p[0];
  miny = o[1] < p[1] ? o[1] : p[1];
  maxy = o[1] > p[1] ? o[1] : p[1];
  return q[0] >= minx && q[0] <= maxx && q[1] >= miny && q[1] <= maxy;
}
function crossTC(p1, q1, p2, q2) {
  d1 = directTC(p2, q2, p1);
  d2 = directTC(p2, q2, q1);
  d3a = directTC(p1, q1, p2);
  d4 = directTC(p1, q1, q2);
  if (d1 * d2 < 0 && d3a * d4 < 0) {
    return true;
  } else if (d1 == 0 && onLineSegmentTC(p2, q2, p1)) {
    return true;
  } else if (d2 == 0 && onLineSegmentTC(p2, q2, q1)) {
    return true;
  } else if (d3a == 0 && onLineSegmentTC(p1, q1, p2)) {
    return true;
  } else if (d4 == 0 && onLineSegmentTC(p1, q1, q2)) {
    return true;
  }
  return false;
}

function getTextPosition(center, maxRadius) {
  var radius = [];
  for (var i = 0; i < 8; i++) {
    radius.push(maxRadius + 10);
  }
  var textPosition = getRadarPoint(center, radius);
  return textPosition;
}
function addText(center, maxRadius, svg) {


  var textArray = [
    "Number of flows",
    "avg Intersaction",
    "max Intersantion",
    "avg Ebt",
    "max Ebt",
    "representation transform",
    "representation variance",
    "Maximum flow"
  ];
  var textPosition = [
    [279, 269],
    [137, 311],
    [6, 267],
    [15, 165],
    //[0, 175],
    [35, 80],
    [147, 40],
    [270, 71],
    [305, 165],
    [313, 175]
  ];
  for (var i = 0; i < textPosition.length; i++) {
    svg
      .append("text")
      .attr("x", textPosition[i][0])
      .attr("font-size", "10px")
      .attr("y", textPosition[i][1])
      .text(textArray[i]);
  }
}

function addRadarView(allRadiusArray, data) {
  var margin = { top: 20, left: 20, right: 20, bottom: 20 };
  var svgWidth = parseFloat(d3.select("#raderSvg").attr("width"));
  var svgHeight = parseFloat(d3.select("#raderSvg").attr("height"));
  ////////////console.log(svgWidth);
  ////////////console.log(svgHeight);
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  var svg = d3.select("#raderSvg");
  svg.selectAll("text").remove();
  svg.selectAll("rect").remove();
  svg.selectAll("circle").remove();
  svg.selectAll("path").remove();
  svg.selectAll("line").remove();
  var center = [svgWidth / 2, svgHeight / 2 + 10];
  var minRadius = 40;
  var pad = 20;
  var maxRadius = minRadius + 4 * pad; //120
  var colorScale = d3.scaleOrdinal().range(["#639EDC", "#4aa973", "#f3a534"]);
  var textSacle = d3
    .scaleOrdinal()
    .range(["original", "our method", "random sample"]);
  for (var i = 0; i < 2; i++) {
    svg
      .append("rect")
      .attr("x", 10)
      .attr("y", 30 + i * 10)
      .attr("width", 10)
      .attr("height", 6)
      .attr("fill", colorScale(i));
  }
  for (var i = 0; i < 2; i++) {
    svg
      .append("text")
      .attr("x", 23)
      .attr("y", 35 + i * 10)
      .attr("class", "radarText")
      .text(textSacle(i));
  }
  var line = d3
    .line()
    .x(function(d) {
      ////////////console.log(d);
      return d[0];
    })
    .y(function(d) {
      return d[1];
    })
    .curve(d3.curveCardinalClosed.tension(0.3));

  for (var i = 0; i < 5; i++) {
    d3
      .select("#raderSvg")
      .append("circle")
      .attr("cx", center[0])
      .attr("cy", center[1])
      .attr("r", minRadius + pad * i)
      .style("stroke", "#CDCDCD")
      .style("fill", "#CDCDCD")
      .style("stroke-width", 1.5)
      .style("stroke-opacity", 0.5)
      .style("fill-opacity", 0.1);
  }
  /*
                      圆心坐标：(x0,y0)
                      半径：r
                      角度：a0
  
                      则圆上任一点为：（x1,y1）
                      x1   =   x0   +   r   *   cos(ao   *   3.14   /180   )
                      y1   =   y0   +   r   *   sin(ao   *   3.14   /180   )
                       */
  let a0 = 360 / 8;
  var lineEndPoint = [];
  for (var i = 0; i < 8; i++) {
    let lineEndPointX =
      center[0] + maxRadius * Math.cos(a0 * (i + 1) * Math.PI / 180);
    let lineEndPointY =
      center[1] + maxRadius * Math.sin(a0 * (i + 1) * Math.PI / 180);
    lineEndPoint.push([lineEndPointX, lineEndPointY]);

    svg
      .append("line")
      .attr("x1", center[0])
      .attr("y1", center[1])
      .attr("x2", lineEndPointX)
      .attr("y2", lineEndPointY)
      .attr("stroke", "white");
  }
  ////////console.log("allRadiusArray: ", allRadiusArray);
  var allEndPoints = getAllEndPoints(center, allRadiusArray);
  addRader(line, allEndPoints, svg, colorScale, data);
  addText(center, maxRadius, svg);
} //addradarview

function getRadarPoint(center, radius) {
  let a0 = 360 / 8;
  let endPoints = [];
  for (var i = 0; i < 8; i++) {
    let lineEndPointX =
      center[0] + radius[i] * Math.cos(a0 * (i + 1) * Math.PI / 180);
    let lineEndPointY =
      center[1] + radius[i] * Math.sin(a0 * (i + 1) * Math.PI / 180);
    endPoints.push([lineEndPointX, lineEndPointY]);
  }
  ////////////console.log(endPoints);
  return endPoints;
}
function getAllEndPoints(center, radiusArray) {
  var allEndPoints = [];
  for (var i = 0; i < 2; i++) {
    allEndPoints.push(getRadarPoint(center, radiusArray[i]));
  }
  return allEndPoints;
}

function addRader(line, allEndPoints, svg, colorScale, data) {
  //////console.log('data: ', data);
  svg
    .selectAll(".path")
    .data(data)
    .enter()
    .append("path")
    .attr("fill", function(d, i) {
      return colorScale(i);
    })
    .attr("fill-opacity", " 0.35")
    //    设置路径信息
    .attr("d", function(d, i) {
      return line(allEndPoints[i]);
    })
    .on("mouseover", function(d, i) {
      ////////console.log(data);
      ////////console.log(data[i]);
      ////////console.log(i);
      d3.select(this).style("fill-opacity", 0.7);
    })
    .on("mouseout", function(d, i) {
      d3.select(this).style("fill-opacity", 0.35);
    });
  /*for (var i = 0; i < allEndPoints.length; i++) {
    for (var j = 0; j < allEndPoints[i].length; j++) {
      svg
        .append("circle")
        .attr("cx", allEndPoints[i][j][0])
        .attr("cy", allEndPoints[i][j][1])
        .attr("r", 2)
        .attr("fill", colorScale(i))
        .on("mouseover", function(d, i) {});
    }
  }
  */
  //////console.log("allEndPoints: ", allEndPoints);
  for (var j = 0; j < allEndPoints.length; j++) {
    svg
      .append("g")
      .selectAll("circle")
      .data(data[j])
      .enter()
      .append("circle")
      .attr("cx", function(d, i) {
        return allEndPoints[j][i][0];
      })
      .attr("cy", function(d, i) {
        return allEndPoints[j][i][1];
      })
      .attr("r", 2.5)
      .attr("fill", colorScale(j))
      .on("mouseover", function(d, i) {
        //////console.log(data[j][i]);
      });
  }
}

var tip = d3
  .tip()
  .attr("class", "d3-tip")
  .offset([-10, 0])
  .html(function(d, i) {
    //////////console.log(i);
    return (
      "<strong>Flow:</strong> <span style='color:red'>" +
      d3.format(".4")(avgVolumeData[i]) +
      "</span>"
    );
  });
