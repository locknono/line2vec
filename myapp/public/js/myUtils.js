function download_sprite_as_png(renderer, sprite, fileName) {
  renderer.extract.canvas(sprite).toBlob(function (b) {
    var a = document.createElement('a');
    document.body.append(a);
    a.download = fileName;
    a.href = URL.createObjectURL(b);
    a.click();
    a.remove();
  }, 'image/png');
}

function calDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}

function removeBeforeChangeDataSet() {
  document.getElementById("BrushButton").setAttribute("name", "false");
  d3.selectAll(".leaflet-pixi-overlay").remove();
  d3.selectAll("#scatterSvg").remove();
  d3.selectAll(".brush").remove();
  stage.removeChildren();

  d3.selectAll(".brush").remove();
  document.getElementById("BrushButton").setAttribute("name", "false");
  document
    .getElementById("brushImg")
    .setAttribute("src", "images/brushClose.png");
  d3.select("#scatterSvg").on("click", null);
  document.getElementById("selectPointButton").setAttribute("name", "false");
  document
    .getElementById("selectPointImg")
    .setAttribute("src", "images/selectPointClose.png");
  d3.select("#markRect").remove();
}

function getScatterXYScale(scatterData, scatterPlotWidth, scatterPlotHeight) {
  var xMin = d3.min(scatterData, d => {
      return d.x;
    }),
    xMax = d3.max(scatterData, d => {
      return d.x;
    }),
    yMin = d3.min(scatterData, d => {
      return d.y;
    }),
    yMax = d3.max(scatterData, d => {
      return d.y;
    });
  // 360 *380  551-420=131
  var xScale = d3.scale
    .linear()
    .domain([xMin, xMax])
    .range([10, scatterPlotWidth - 10]);
  var yScale = d3.scale
    .linear()
    .domain([yMin, yMax])
    .range([scatterPlotHeight - 20, 35]);
  return [xScale, yScale];
}

function drawScatterPlot(
  scatterData,
  labelColorScale,
  scatterPlotWidth,
  scatterPlotHeight,
  stage,
  circle,
  comDetecFlag,
  labelData = undefined,
  filterRate = 0
) {
  if (filterRate === 0) {
    circle.clear();
    var xyScale = getScatterXYScale(
        scatterData,
        scatterPlotWidth,
        scatterPlotHeight
      ),
      xScale = xyScale[0],
      yScale = xyScale[1];
    let imgFileName = op.img_root_path + op.sample_rate + '_' + op.sample_method + '.png';
    if (scatterData.length > 35000) {
      if (comDetecFlag === true) {
        d3.select("#scatterImg").attr("src", op.originalScatterImg.replace('.png', '_com.png'));
      } else {
        d3.select("#scatterImg").attr("src", op.originalScatterImg);
      }
    } else {
      if (comDetecFlag === true) {
        d3.select("#scatterImg").attr("src", imgFileName.replace('.png', '_com.png'));
      } else {
        d3.select("#scatterImg").attr("src", imgFileName);
      }
    }
  } else if (filterRate !== 0) {
    circle.clear();
    var xyScale = getScatterXYScale(
        scatterData,
        scatterPlotWidth,
        scatterPlotHeight
      ),
      xScale = xyScale[0],
      yScale = xyScale[1];
    //draw inter first
    for (var i = 0; i < scatterData.length; i++) {
      if (scatterData[i].label !== -1) {
        continue;
      }
      if (comDetecFlag == false) {
        scatterCircleGraphics.beginFill(op.scatterColor);
      } else {
        scatterCircleGraphics.beginFill(
          op.labelColorScale(scatterData[i].label).replace("#", "0x")
        );
      }
      scatterCircleGraphics.drawCircle(xScale(scatterData[i].x), yScale(scatterData[i].y), 1.5);
      scatterCircleGraphics.endFill();
    }
    for (var i = 0; i < scatterData.length; i++) {
      if (scatterData[i].label === -1) {
        continue;
      }
      if (comDetecFlag == false) {
        scatterCircleGraphics.beginFill(op.scatterColor);
      } else {
        scatterCircleGraphics.beginFill(
          op.labelColorScale(scatterData[i].label).replace("#", "0x")
        );
      }
      scatterCircleGraphics.drawCircle(xScale(scatterData[i].x), yScale(scatterData[i].y), 1.5);
      scatterCircleGraphics.endFill();
    }
  }
  if (labelData !== undefined) {
    for (var i = 0; i < labelData.length; i++) {
      circle.beginFill(
        labelColorScale(0x000000)
      );
      circle.drawCircle(xScale(labelData[i].x), yScale(labelData[i].y), 1.5);
      circle.endFill();
    }
  }
  renderer.render(stage);
  // download_sprite_as_png(renderer,stage,'a.png');
}

function unbindEvents() {
  $("#BrushButton").unbind();
  $("#reset").unbind();
  $("#initialize").unbind();
  $("#selectAll").unbind();
  $("#selectPointButton").unbind();
}

function brushEnded() {}
//select edge flux
function showflux(source, target) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "get",
      url: "/getFlux",
      data: {
        source: source,
        target: target
      },
      success: function (data) {
        resolve(data);
      },
      error: function () {

      }
    });
  });
}

function colorRGB2Hex(color) {
  var rgb = color.split(",");
  var r = parseInt(rgb[0].split("(")[1]);
  var g = parseInt(rgb[1]);
  var b = parseInt(rgb[2].split(")")[0]);
  var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}

function baseshowflux(sitesname) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "post",
      url: "/getBaseFlux",
      data: {
        sites: sitesname
      },
      success: function (data) {
        resolve(data);
      },
      error: function () {
        ////////////////
      }
    });
  });
}

//mf
function constructCurve(allSelectedMapLines) {
  var artLine = new Array();
  // get the line which has relationship
  var tclines = new Array();
  for (var index = 0; index < allSelectedMapLines.length; index++) {
    temp = allSelectedMapLines[index];
    var nooblines = new Array();
    var th_fre = 1;
    th_len = 1;
    if (temp.length > 300) {
      th_fre = 5;
      th_len = 5;
    }
    for (var i = 0; i < temp.length - 1; i++) {
      var tcline = new Array();
      tempS = temp[i];
      tcline.push(tempS);

      for (var j = i + 1; j < temp.length; j++) {
        tempT = temp[j];
        if (tempS.target == tempT.source && tempT.fre > th_fre) {
          tempT.width = (Math.log10(tempT.fre) + 1) / 10;
          tcline.push(tempT);
        }
        if (tempS.source == tempT.target && tempT.fre > th_fre) {
          tempT.width = (Math.log10(tempT.fre) + 1) / 10;
          tcline.push(tempT);
        }
      }
      if (tcline.length > th_len) {
        nooblines.push(tcline);
      }
    }
    tclines.push(nooblines);
  }
  return tclines;
}

function getArcScale(avgVolumeData, minRadius) {
  var max = d3.max(avgVolumeData);
  var min = d3.min(avgVolumeData);
  var radiusLinear = d3
    .scaleLinear()
    .domain([min, max])
    .range([minRadius + 5, minRadius + 30]);

  var arcColorLinear = d3
    .scaleLinear()
    .domain([min, max])
    .range([0, 1]);
  var colorInterpolate = d3.interpolate(
    d3.rgb(115, 183, 255),
    d3.rgb(57, 92, 127)
  );
  return [radiusLinear, arcColorLinear, colorInterpolate];
}

function getLineNumberScale(volumeData, minRadius) {
  var lineNumberArray = getHourLineNumber(volumeData);
  var max = d3.max(lineNumberArray);
  var min = d3.min(lineNumberArray);
  ////////
  //var min = 0;
  var lineNumberScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([minRadius + 17, minRadius + 35]);
  return lineNumberScale;
}

function getArcArray(
  volumeData,
  avgVolumeData,
  minRadius,
  allArcArray,
  scales
) {
  var lineNumberArray = getHourLineNumber(volumeData);
  ////
  //var scales = getArcScale(avgVolumeData, minRadius);
  var arcArray = [];
  var thisPad = 2 * Math.PI / 24;
  for (var i = 0; i < avgVolumeData.length; i++) {
    var thisArc = new Object();
    thisArc.startAngle = thisPad * i + thisPad / 12;
    thisArc.endAngle = thisPad * (i + 1) - thisPad / 12;
    thisArc.innerRadius = minRadius + 13;
    thisArc.outerRadius = getLineNumberScale(volumeData, minRadius)(
      lineNumberArray[i]
    );
    arcArray.push(thisArc);
  }
  allArcArray.push(arcArray);
}

function dragEndChangeArcArray(
  volumeData,
  avgVolumeData,
  minRadius,
  allArcArray,
  scales,
  index
) {
  var lineNumberArray = getHourLineNumber(volumeData);
  var arcArray = [];
  var thisPad = 2 * Math.PI / 24;
  for (var i = 0; i < avgVolumeData.length; i++) {
    var thisArc = new Object();
    thisArc.startAngle = thisPad * i + thisPad / 9;
    thisArc.endAngle = thisPad * (i + 1) - thisPad / 9;
    thisArc.innerRadius = minRadius + 13;
    thisArc.outerRadius = getLineNumberScale(volumeData, minRadius)(
      lineNumberArray[i]
    );
    arcArray.push(thisArc);
  }
  allArcArray[index] = arcArray;
}

function getSitesName(selectedMapLines) {
  var sites = [];
  for (var i = 0; i < selectedMapLines.length; i++) {
    name = selectedMapLines[i].source + "-" + selectedMapLines[i].target;
    sites.push(name);
  }
  for (var i = 0; i < selectedMapLines.length; i++) {
    name = selectedMapLines[i].target + "-" + selectedMapLines[i].source;
    sites.push(name);
  }
  return sites;
}

function changeVolumeArray(volumeData) {
  for (var i = 0; i < volumeData.length; i++) {
    volumeData[i].value = [].concat.apply([], volumeData[i].value);
  }
}

function getAvgVolumeData(volumeData) {
  var avgVolumeData = [];
  var arrayLength = volumeData[0].value.length;
  for (var i = 0; i < arrayLength; i++) {
    avgVolumeData[i] = 0;
  }
  for (var i = 0; i < volumeData.length; i++) {
    for (var j = 0; j < arrayLength; j++) {
      avgVolumeData[j] += volumeData[i].value[j];
    }
  }
  for (var i = 0; i < arrayLength; i++) {
    avgVolumeData[i] = avgVolumeData[i] / volumeData.length;
  }
  if (avgVolumeData.length > 24) {
    for (var i = 95; i >= 48; i--) {
      avgVolumeData.splice(i, 1);
    }
    for (var i = 0; i <= 23; i++) {
      avgVolumeData.splice(0, 1);
    }
  }
  //
  return avgVolumeData;
}

function getHourLineNumber(volumeData) {
  var lineNumberArray = [];
  for (var i = 0; i < 24; i++) {
    lineNumberArray[i] = 0;
  }
  for (var i = 0; i < volumeData.length; i++) {
    for (var j = 0; j < 24; j++) {
      if (volumeData[i].value[j + 24] > 0) {
        lineNumberArray[j]++;
      }
    }
  }
  return lineNumberArray;
}

function writeFile(directory, data) {
  const str = JSON.stringify(data);
  let url = "//localhost:3000/writeMetric";
  $.ajax({
    method: "post",
    type: "json",
    url,
    data: {
      directory,
      data: str
    },
    success: (result, status) => {
      if (status == 200 && result.success) {
        ////////
      } else {
        ////////
      }
    }
  });
}

function addCommunityRect(
  scatterData,
  scatterSvg,
  scatterPlotWidth,
  scatterPlotHeight,
  labelColorScale
) {
  //draw community rects   represent count of communities
  var commNumber =
    2 +
    d3.max(scatterData, function (d) {
      return d.label;
    });
  ////////
  var Com_arr = [];
  for (var i = 0; i < commNumber; i++) {
    Com_arr[i] = i - 1;
  }
  var Com_rec_color = scatterSvg
    .selectAll("rec")
    .data(Com_arr)
    .enter()
    .append("rect")
    .attr("class", "labelRect")
    .attr("x", function (d, i) {
      if (d != -1) {
        return i * 8 - 5;
      } else if (d == -1) {
        return scatterPlotWidth - 107;
      }
    })
    .attr("y", function (d, i) {
      return scatterPlotHeight - 14;
    })
    .attr("stroke", "white")
    .attr("stroke-width", "0.5px")
    .attr("width", "8px")
    .attr("height", "10px")
    .style("fill", function (d, i) {
      return labelColorScale(d);
    });

  max_Com = Com_arr[Com_arr.length - 1] + 2;

  scatterSvg
    .append("text")
    .text(max_Com - 1 + " communities ")
    .attr("font-size", "10px")
    .attr("x", (max_Com - 1) * 8 + 6)
    .attr("y", scatterPlotHeight - 15 + 9.5);
  scatterSvg
    .append("text")
    .text("inter-community")
    .attr("font-size", "10px")
    .attr("x", scatterPlotWidth - 96)
    .attr("y", scatterPlotHeight - 15 + 9.5);
}

var cloneObj = function (obj) {
  var str,
    newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== "object") {
    return;
  } else if (window.JSON) {
    (str = JSON.stringify(obj)), //系列化对象
    (newobj = JSON.parse(str)); //还原
  } else {
    for (var i in obj) {
      newobj[i] = typeof obj[i] === "object" ? cloneObj(obj[i]) : obj[i];
    }
  }
  return newobj;
};

function Queue() {
  this.dataStore = [];
  this.enqueue = enqueue;
  this.dequeue = dequeue;
  this.front = front;
  this.back = back;
  this.count = count;
  this.toString = toString;
  this.empty = empty;
}

function enqueue(element) {
  this.dataStore.push(element);
}

function dequeue() {
  return this.dataStore.shift();
}

function front() {
  return this.dataStore[0];
}

function back() {
  return this.dataStore[this.dataStore.length - 1];
}

function toString() {
  var retStr = "";
  for (var i = 0; i < this.dataStore.length; ++i) {
    retStr += this.dataStore[i] + "&nbsp;";
  }
  return retStr;
}

function empty() {
  if (this.dataStore.length == 0) {
    return true;
  } else {
    return false;
  }
}

function count() {
  return this.dataStore.length;
}