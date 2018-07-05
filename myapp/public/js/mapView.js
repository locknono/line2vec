var dataOverViewSvg = d3.select("#dataOverViewSvg");
var scatterPlotWidth = 360,
  scatterPlotHeight = 380;

var map = L.map("map", {
  renderer: L.canvas(),
  zoomControl: false,
  attributionControl: false,
  zoomSnap: 0.7
}).setView([27.9792688, 120.698735], 11);
var osmUrl =
  "https://api.mapbox.com/styles/v1/lockyes/cjiva3omz8hrq2so4mfdaurmw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9ja3llcyIsImEiOiJjamlvaDExMW8wMDQ2M3BwZm03cTViaWwwIn0.AWuS0iLz_Kbk8IOrnm6EUg",
  layer =
  'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
L.tileLayer(osmUrl, {
  minZoom: 1,
  maxZoom: 18,
  //用了mapbox的图层
  attribution: layer,
  //访问令牌
  accessToken: "your.mapbox.access.token"
}).addTo(map);
var options = {
  position: "topleft", // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
  drawMarker: false, // adds button to draw markers
  drawPolyline: false, // adds button to draw a polyline
  drawRectangle: false, // adds button to draw a rectangle
  drawPolygon: false, // adds button to draw a polygon
  drawCircle: true, // adds button to draw a cricle
  cutPolygon: false, // adds button to cut a hole in a polygon
  editMode: true, // adds button to toggle edit mode for all layers
  removalMode: true // adds a button to remove layers
};
map.pm.addControls(options);
var selectTime = 0;
var clickSourceLatLng;
var clickProjectSourceLatLng;
var clickTargetLatLng;
var clickProjectTargetLatLng;
var containerPoint1;
var containerPoint2;
var d3SvgLayer;
var allSelectedMapLines = [];
var transformArray = [];
var svgLayerArray = [];
var lastLayer;
var lastLayers = [];
var bars = [];
var minRadius;
var allArcArray = [];
var arcArray = [];
var comDetecFlag = false;
var selectedColor = 0x3388ff;
var artLineMaxValue = 1000;
var artLineMinValue = 0;
var artLineStartIndex = 0;
var artLineEndIndex = 1000;
var timeString = "6-8";
var selectAllFlag = false;
var allTrack = [];
var selectedMapLines = [];
var filterRate = 0;
var trackLength = 0;
var sampleFlag = false;

var circleBarsInterpolate = d3.interpolate(op.circleBarStartColor, op.circleBarEndColor);

var underMapColorDefs = d3.select("#underMapView").append("defs");
var linearGradient = underMapColorDefs
  .append("linearGradient")
  .attr("id", "underMapColorBar")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");
var stop1 = linearGradient
  .append("stop")
  .attr("offset", "0%")
  .style("stop-color", circleBarsInterpolate(0).toString());

var stop2 = linearGradient
  .append("stop")
  .attr("offset", "100%")
  .style("stop-color", circleBarsInterpolate(1).toString());

d3
  .select("#underMapView")
  .append("rect")
  .attr("x", 640)
  .attr("y", 5)
  .attr("width", 55)
  .attr("height", 10)
  .attr("fill", "url(#" + linearGradient.attr("id") + ")");
d3
  .select("#underMapView")
  .append("text")
  .attr("font-size", "10px")
  .attr("x", 575)
  .attr("y", 13.5)
  .text("Flow Volume");

//像素图的color bar
var pixelSvg = d3
  .select("#pixelView")
  .append("svg")
  .attr("width", 228)
  .attr("height", 21.8)
  .style("position", "absolute")
  .style("top", "0px")
  .style("left", "0px");
var pixelColorDefs = pixelSvg.append("defs");
var pixelLinearGradient = pixelColorDefs
  .append("linearGradient")
  .attr("id", "pixelColorBar")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");
var stop1 = pixelLinearGradient
  .append("stop")
  .attr("offset", "0%")
  .style("stop-color", d3.interpolateBlues(0).toString());

var stop2 = pixelLinearGradient
  .append("stop")
  .attr("offset", "100%")
  .style("stop-color", d3.interpolateBlues(1).toString());

pixelSvg
  .append("rect")
  .attr("x", 170)
  .attr("y", 5)
  .attr("width", 55)
  .attr("height", 10)
  .attr("fill", "url(#" + pixelLinearGradient.attr("id") + ")");
pixelSvg
  .append("text")
  .attr("font-size", "10px")
  .attr("x", 130)
  .attr("y", 14)
  .text("Overlap");

var stage = new PIXI.Container();
var scatterCircleGraphics = new PIXI.Graphics();
var selectedCircleGraphics = new PIXI.Graphics();
var allSelectedCirclesGraphics = new PIXI.Graphics();
var dragDrawCricleGraphics = new PIXI.Graphics();
stage.addChild(scatterCircleGraphics);
stage.addChild(dragDrawCricleGraphics);
stage.addChild(allSelectedCirclesGraphics);
stage.addChild(selectedCircleGraphics);
var scatterCanvas = document.getElementById("scatterCanvas");
var renderer = PIXI.autoDetectRenderer(scatterPlotWidth + 0.01, scatterPlotHeight + 0.02, {
  view: scatterCanvas,
  antialias: true,
  transparent: !0,
  resolution: 1
});

d3.select("#scatterImg").attr("src", op.originalScatterImg)
  .style("width", scatterPlotWidth)
  .style("height", scatterPlotHeight)
  .style("position", "absolute")
  .style("top", "0px")

document.getElementById("scatterPlot").appendChild(renderer.view);
var pCanvas = document.getElementById("pixelCanvas");
var pStage = new PIXI.Container();
var pixelGraphics = new PIXI.Graphics();
var pRenderer = PIXI.autoDetectRenderer(230, 135, {
  view: pCanvas,
  forceFXAA: true,
  antialias: false,
  transparent: !0,
  resolution: 1
});
document.getElementById("pixelView").appendChild(pRenderer.view);

var mapCircleRadius = 0.03;
var CHIFileList = [
  "data/CHIstationIDLocation.csv",
  "data/CHIlinedetail_label.csv",
  "data/CHIlinedetail_label_sample.csv",
  "data/CHIlinedetail_label_randomSample.csv"
];
var BSFileList = [
  op.fileList.id_location_file,
  op.fileList.original_file,
  op.fileList.sample_file
];
// load(BSFileList[0], BSFileList[1], BSFileList[2], BSFileList[3]);
$("#stationNumber").text("Location count:2970");
$("#linesNumberBeforeSample").text("Original Flow Count:65952");
$("#linesNumberAfterSample").text("Sampled Flow Count:10342");
load(BSFileList[0], BSFileList[1], BSFileList[2]);

function load(
  stationIDLocationFile,
  linedetail_labelFile,
  linedetail_label_sampleFile
) {
  Promise.all([
    getMapData(stationIDLocationFile),
    getScatterData(linedetail_labelFile),
    getScatterData(linedetail_label_sampleFile)
  ]).then(function (values) {

    var mapData = values[0];
    var scatterData = values[1];
    var sampledScatterData = values[2];
    var filterData = [];
    var filterFlag = false;
    //downloadPng(scatterData);
    function downloadPng(sampledScatterData) {
      if ($("#comDetec").is(":checked")) {
        var comDetecFlag = true;
      } else {
        var comDetecFlag = false;
      }
      // comDetecFlag=true;
      scatterCircleGraphics.clear();
      var xyScale = getScatterXYScale(
          scatterData,
          scatterPlotWidth,
          scatterPlotHeight
        ),
        xScale = xyScale[0],
        yScale = xyScale[1];
      //draw inter first
      for (var i = 0; i < sampledScatterData.length; i++) {
        if (sampledScatterData[i].label !== -1) {
          continue;
        }
        if (comDetecFlag == false) {
          scatterCircleGraphics.beginFill(op.scatterColor);
        } else {
          scatterCircleGraphics.beginFill(
            op.labelColorScale(sampledScatterData[i].label).replace("#", "0x")
          );
        }
        scatterCircleGraphics.drawCircle(xScale(sampledScatterData[i].x), yScale(sampledScatterData[i].y), 1.5);
        scatterCircleGraphics.endFill();
      }
      for (var i = 0; i < sampledScatterData.length; i++) {
        if (sampledScatterData[i].label === -1) {
          continue;
        }
        if (comDetecFlag == false) {
          scatterCircleGraphics.beginFill(op.scatterColor);
        } else {
          scatterCircleGraphics.beginFill(
            op.labelColorScale(sampledScatterData[i].label).replace("#", "0x")
          );
        }
        scatterCircleGraphics.drawCircle(xScale(sampledScatterData[i].x), yScale(sampledScatterData[i].y), 1.5);
        scatterCircleGraphics.endFill();
      }
      var fileName = '';
      fileName += op.sample_rate + '_';
      var sample_method = "";
      if ($("#checkBtw").is(":checked")) {
        sample_method += "0";
      }
      if ($("#checkOverlap").is(":checked")) {
        sample_method += "1";
      }
      if ($("#checkComm").is(":checked")) {
        sample_method += "2";
      }
      fileName += sample_method
      if ($("#comDetec").is(":checked")) {
        fileName += "_com";
      }
      download_sprite_as_png(renderer, stage, fileName);
    }

    //  downloadPng(sampledScatterData);

    $("#linesNumberBeforeSample").text(
      "Original Flow Count:" + scatterData.length
    );
    $("#linesNumberAfterSample").text(
      "Sampled Flow Count:" + sampledScatterData.length
    );
    var brushTime = 0;
    var formerSelectedCircle = [];
    var laterSelectedCircle = [];
    var recorder = [];
    var polylines = [];
    var sampled = false;
    var word2vecFlag = false;
    var leafletSvgOverlay;
    var leafletPixiContaioner = new PIXI.Container();
    var firstDraw = true;
    var prevZoom;
    var line = new PIXI.Graphics();
    var multiLineGraphics = new PIXI.Graphics();
    var mapCircleGraphics = new PIXI.Graphics();
    var dragLineGraphics = new PIXI.Graphics();
    var selectedMapCircleGraphics = new PIXI.Graphics();
    var selectedCircles = [];
    var SVGcurrentZoom;
    var drag;
    var selectedMapData = [];
    var flowSliderValue = 0;
    var maxValue;
    var minValue;

    leafletPixiContaioner.addChild(line);
    leafletPixiContaioner.addChild(dragLineGraphics);
    leafletPixiContaioner.addChild(multiLineGraphics);
    leafletPixiContaioner.addChild(mapCircleGraphics);
    leafletPixiContaioner.addChild(selectedMapCircleGraphics);

    var brush = d3.brush();
    if (d3.selectAll("#scatterSvg").empty()) {
      var scatterSvg = d3
        .select("#scatterPlot")
        .append("svg")
        .attr("id", "scatterSvg")
        .attr("width", scatterPlotWidth)
        .attr("height", scatterPlotHeight)
        .attr("class", "sSvg")
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0);
    }

    /* getScatterData('data/CHIlinedetail_label.csv').then(e=>{
      
      drawScatterPlot(
        e,
        op.labelColorScale,
        scatterPlotWidth,
        scatterPlotHeight,
        stage,
        scatterCircleGraphics,
        comDetecFlag=true
      )
    }) */
    drawScatterPlot(
      scatterData,
      op.labelColorScale,
      scatterPlotWidth,
      scatterPlotHeight,
      stage,
      scatterCircleGraphics,
      comDetecFlag
    );

    var arcColor = d3.scaleThreshold();
    arcColor
      .domain([0, 2, 4, 8, 16, 32, 64, 128, 256, 512])
      .range([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
    var arc = d3
      .arc()
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .innerRadius(d => d.innerRadius)
      .outerRadius(d => d.outerRadius);

    function calDis(stationPoint, clickSourceLatLng) {
      return Math.sqrt(
        Math.pow(stationPoint.x - clickSourceLatLng.x, 2) +
        Math.pow(stationPoint.y - clickSourceLatLng.y, 2)
      );
    }

    var leafletPixiOverlay = L.pixiOverlay(function (utils) {

        var zoom = utils.getMap().getZoom();
        var container = utils.getContainer();
        var leafletRenderer = utils.getRenderer();
        var project = utils.latLngToLayerPoint;

        var arcColor = d3.scaleThreshold()
          .domain([0, 2, 4, 8, 16, 32, 64, 128, 256, 512])
          .range([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);

        $(".leaflet-pm-icon-circle").unbind();

        //one svg layer will be added to the map when drag or zoom 
        var d3Overlay = L.d3SvgOverlay(
          function (selection, projection) {
            map.off("pm:create");

            function drawArtLine(timeString, random = false) {
              new Promise(function (resolve, reject) {
                $.ajax({
                  type: "post",
                  url: "/drawArtLine",
                  data: {
                    selectedMapData: selectedMapData,
                    timeString: timeString,
                    sFile: op.getSampleFile(),
                    randomFlag: random,
                    filterRate: filterRate,
                    sample_rate: op.sample_rate,
                    sampleFlag: sampleFlag,
                  },
                  success: function (data) {
                    resolve(data);
                  },
                  error: function () {

                  }
                });
              }).then(function (resData) {
                var allTrack = resData.allTrack;
                $("#selectedNumber").text("Selected Flows:" + allTrack.length);
                var thisTimeTrackSet = resData.thisTimeTrackSet;
                maxValue = d3.max(allTrack, function (d) {
                  return d.value;
                });
                minValue = d3.min(allTrack, function (d) {
                  return d.value;
                });
                drawStraightLine(allTrack);

                $("#flowSlider").slider({
                  //range:true,
                  min: minValue,
                  max: 50,
                  step: 1,
                  value: minValue,
                  // value:[0,100],
                  slide: function (event, ui) {
                    $("#flowSliderAmount").val(ui.value);
                    flowSliderValue = ui.value;
                    drawStraightLine(allTrack);
                  },
                  stop: function (event, ui) {
                    flowSliderValue = ui.value;
                    drawStraightLine(allTrack);
                  }
                });

                function drawStraightLine(allTrack) {

                  allTrack.sort(function (a, b) {
                    return b.lineCoors.length - a.lineCoors.length;
                  });
                  d3.select("#map").selectAll(".artLine").remove();
                  d3.select("#map").selectAll("defs").remove();
                  var lineGenarator = d3
                    .line()
                    .x(function (d) {
                      return projection.latLngToLayerPoint(d).x;
                    })
                    .y(function (d) {
                      return projection.latLngToLayerPoint(d).y;
                    })
                    .curve(d3.curveCatmullRom);

                  var defs = selection.append("defs");
                  var arrowMarker = defs
                    .append("marker")
                    .attr("id", "arrow")
                    .attr("markerUnits", "strokeWidth")
                    .attr("markerWidth", "2")
                    .attr("markerHeight", "2")
                    .attr("fill", "black")
                    .attr("stroke", "#000000")
                    .attr("viewBox", "0 0 12 12")
                    .attr("refX", "6")
                    .attr("refY", "6")
                    .attr("orient", "auto");
                  var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

                  arrowMarker
                    .append("path")
                    .attr("d", arrow_path)
                    .style("z-index", 5000)
                    .style("fill", "#000000");
                  let minValue = 0;
                  var widthScale = d3
                    .scaleLinear()
                    .domain([minValue, 8])
                    .range([op.minArtLineWidth, op.maxArtLineWidth]);
                  //var wfCounter = 0;
                  for (let i = artLineEndIndex; i >= artLineStartIndex; i--) {
                    if (i > allTrack.length - 1) {
                      continue;
                    }
                    let coors = allTrack[i].lineCoors;
                    let coorsSet = new Set();
                    if (allTrack[i].value < flowSliderValue) {
                      continue;
                    }
                    for (let j = 0; j < coors.length; j++) {
                      coorsSet.add(coors[j][0] + '-' + coors[j][1]);
                    }
                    if (coorsSet.size === 2 && coors.length > 2) {
                      /* wfCounter += 1;
                      if (wfCounter > 1) {
                        continue
                      } */
                      /* ifs (i % 2 !== 0) {
                        continue;
                      } */
                      var path = d3.path();
                      path.moveTo(projection.latLngToLayerPoint(coors[0]).x, projection.latLngToLayerPoint(coors[0]).y);
                      for (let j = 0; j < 2; j++) {
                        var thisPoint = coors[j].map(parseFloat);
                        var nextPoint = (coors[j + 1]).map(parseFloat);
                        var d = Math.sqrt(Math.pow(nextPoint[1] - thisPoint[1], 2) + Math.pow(nextPoint[0] - thisPoint[0], 2));
                        var midPointX = (thisPoint[0] + nextPoint[0]) / 2;
                        var midPointY = (thisPoint[1] + nextPoint[1]) / 2;

                        if (nextPoint[0] - thisPoint[0] != 0) {
                          if (k === 0 || k === -0) {
                            continue;
                          }
                          var k = (nextPoint[1] - thisPoint[1]) / (nextPoint[0] - thisPoint[0]);
                          var b = midPointY - k * midPointX;
                          var cpDis = d / 3;
                          if (k > 0) {
                            var angle = Math.asin((nextPoint[1] - thisPoint[1] > 0) ? (nextPoint[1] - thisPoint[1]) / d : (thisPoint[1] - nextPoint[1]) / d);
                            if (j % 2 === 0) {
                              var x0 = midPointX - cpDis * Math.sin(angle);
                              var y0 = midPointY + cpDis * Math.cos(angle);
                            } else {
                              var x0 = midPointX + cpDis * Math.sin(angle);
                              var y0 = midPointY - cpDis * Math.cos(angle);
                            }
                          } else {
                            if (j % 2 === 0) {
                              var angle = Math.acos((nextPoint[1] - thisPoint[1] > 0) ? (nextPoint[1] - thisPoint[1]) / d : (thisPoint[1] - nextPoint[1]) / d);
                              var x0 = midPointX + cpDis * Math.cos(angle);
                              var y0 = midPointY + cpDis * Math.sin(angle);
                            } else {
                              var x0 = midPointX - cpDis * Math.cos(angle);
                              var y0 = midPointY - cpDis * Math.sin(angle);
                            }
                          }
                          var controlPoint = projection.latLngToLayerPoint([x0, y0]);
                          var projectNextPoint = projection.latLngToLayerPoint(nextPoint);
                          path.quadraticCurveTo(controlPoint.x, controlPoint.y, projectNextPoint.x, projectNextPoint.y);
                        }
                      }
                    } else if (coorsSet.size === 2 && coors.length === 2) {
                      var path = d3.path();
                      path.moveTo(projection.latLngToLayerPoint(coors[0]).x, projection.latLngToLayerPoint(coors[0]).y);
                      path.lineTo(projection.latLngToLayerPoint(coors[1]).x, projection.latLngToLayerPoint(coors[1]).y);
                    } else if (coorsSet.size > 2) {
                      /*  let thisTrack = allTrack[i].lineCoors;
                       if (thisTrack[0][0] == thisTrack[thisTrack.length - 1][0] &&
                         thisTrack[0][1] == thisTrack[thisTrack.length - 1][1]) {
                         continue;
                       } */
                      var path = lineGenarator(allTrack[i].lineCoors);
                    }

                    var path = selection
                      .append("path")
                      .attr("class", "artLine")
                      .attr("id", function () {
                        return "artLine" + i;
                      })
                      .attr("stroke-width", widthScale(Math.log2(allTrack[i].value)))
                      .attr("fill", "none")
                      .style("stroke-linecap", "round")
                      .attr("d", path);

                    //set style
                    var color = d3.interpolate(d3.interpolateYlGnBu(0), d3.interpolateYlGnBu(1));

                    if (coorsSet.size >= 2 /*|| (coorsSet.size===2&&coors.length===2)*/ ) {
                      var path = selection.selectAll("[id='artLine" + i + "']").remove();
                      path
                        .data(quads(samples(path.node(), 1)))
                        .enter()
                        .append("path")
                        .style("fill", function (d) {
                          return color(d.t);
                        })
                        .style("stroke", function (d) {
                          return color(d.t);
                        })
                        .classed("artLine", true)
                        /* .attr("pointer-events","auto")
                        .on("mouseover",function(d){
                          d3.selectAll(this).remove();
                        }) */
                        .attr("stroke-linecap", "round")
                        .attr("stroke-linejoin", "round")
                        .attr("d", function (d) {
                          return lineJoin(d[0], d[1], d[2], d[3], widthScale(Math.log2(allTrack[i].value)));
                        });
                    }

                    function samples(path, precision) {
                      var n = path.getTotalLength(),
                        t = [0],
                        i = 0,
                        dt = precision;
                      dt = 1;
                      while ((i += dt) < n) t.push(i);
                      t.push(n);
                      return t.map(function (t) {
                        var p = path.getPointAtLength(t),
                          a = [p.x, p.y];
                        a.t = t / n;
                        return a;
                      });
                    }

                    // Compute quads of adjacent points [p0, p1, p2, p3].
                    function quads(points) {
                      return d3.range(points.length - 1).map(function (i) {
                        var a = [points[i - 1], points[i], points[i + 1], points[i + 2]];
                        a.t = (points[i].t + points[i + 1].t) / 2;

                        return a;
                      });
                    }

                    // Compute stroke outline for segment p12.
                    function lineJoin(p0, p1, p2, p3, width) {
                      var u12 = perp(p1, p2),
                        r = width / 2,
                        a = [p1[0] + u12[0] * r, p1[1] + u12[1] * r],
                        b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r],
                        c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r],
                        d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r];
                      return "M" + a + "L" + b + " " + c + " " + d + "Z";
                    }

                    // Compute intersection of two infinite lines ab and cd.
                    function lineIntersect(a, b, c, d) {
                      var x1 = c[0],
                        x3 = a[0],
                        x21 = d[0] - x1,
                        x43 = b[0] - x3,
                        y1 = c[1],
                        y3 = a[1],
                        y21 = d[1] - y1,
                        y43 = b[1] - y3,
                        ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
                      return [x1 + ua * x21, y1 + ua * y21];
                    }

                    // Compute unit vector perpendicular to p01.
                    function perp(p0, p1) {
                      var u01x = p0[1] - p1[1],
                        u01y = p1[0] - p0[0],
                        u01d = Math.sqrt(u01x * u01x + u01y * u01y);
                      return [u01x / u01d, u01y / u01d];
                    }
                  }
                }

                underMap(thisTimeTrackSet);

                var rectWidth = d3
                  .select(".underMapRectG")
                  .select("rect")
                  .attr("width");

                var rectBrush = d3
                  .brushX()
                  .extent([
                    [10, 23],
                    [690, 150]
                  ])
                  .on("start brush", rectBrushed)
                  .on("end", rectBrushEnd);

                d3
                  .select("#underMapView")
                  .selectAll(".underMapBrush")
                  .remove();

                d3
                  .select("#underMapView")
                  .append("g")
                  .attr("class", "underMapBrush")
                  .call(rectBrush);

                function rectBrushed() {
                  x1 = d3.event.selection[0];
                  x2 = d3.event.selection[1];
                  artLineStartIndex = parseInt((x1 - 10) / rectWidth);
                  artLineEndIndex = parseInt((x2 - 10) / rectWidth);
                  drawStraightLine(allTrack);
                }

                function rectBrushEnd() {
                  x1 = d3.event.selection[0];
                  x2 = d3.event.selection[1];
                  artLineStartIndex = parseInt((x1 - 10) / rectWidth);

                  artLineEndIndex = parseInt((x2 - 10) / rectWidth);

                  drawStraightLine(allTrack);
                }
              })
            }

            map.on("pm:create", function (e) {
              var circle = e.layer;
              lastLayer = e.layer;
              lastLayers.push(e.layer);
              op.drawZoom = map.getZoom();
              map.removeLayer(circle);
              var containerPoint1 = e.layer._point;

              var clickSourceLatLng = e.layer._latlng;
              var minRadius = e.layer._radius;

              transformArray.push(containerPoint1);
              //get selected map data
              selectedMapData = [];
              for (let i = 0; i < mapData.length; i++) {
                let stationPoint = mapData[i].stationLocation;
                if (
                  calDis(
                    projection.latLngToLayerPoint(stationPoint),
                    projection.latLngToLayerPoint(clickSourceLatLng)
                  ) <= minRadius
                ) {
                  selectedMapData.push(mapData[i]);
                }
              }
              if (sampled === true) {
                var data = sampledScatterData;
              } else if (sampled === false) {
                var data = scatterData;
              }

              //use loose equal here,one is string the other is float
              selectedMapLines = [];
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

              allSelectedMapLines.push(selectedMapLines);

              //multidrawCircles(allSelectedMapLines, comDetecFlag);
              //  multidrawLines(allSelectedMapLines);

              drawArtLine(timeString);
              //change flow count text
              var AllLength = 0;
              for (var i = 0; i < allSelectedMapLines.length; i++) {
                AllLength += allSelectedMapLines[i].length;
              }

              baseshowflux(getSitesName(selectedMapLines)).then(function (volumeData) {
                if (volumeData.length === 0) {
                  return;
                }
                changeVolumeArray(volumeData);
                var hourLineNumber = getHourLineNumber(volumeData);
                avgVolumeData = getAvgVolumeData(volumeData);
                var scales = getArcScale(avgVolumeData, minRadius);
                getArcArray(
                  volumeData,
                  avgVolumeData,
                  minRadius,
                  allArcArray,
                  scales
                );
                getRadarData(
                  selectedMapData,
                  scatterData,
                  sampledScatterData,
                  volumeData,
                  maxValue
                );
                var tip = d3
                  .tip()
                  .attr("class", "d3-tip")
                  .offset([-10, 0])
                  .html(function (d, i) {
                    return (
                      "<strong>Flow:</strong> <span style='color:red'>" +
                      d3.format(".4")(avgVolumeData[i]) +
                      "</span><br></br><strong>Line Number:</strong> <span style='color:red'>" +
                      d3.format(".4")(hourLineNumber[i]) +
                      "</span>"
                    );
                  });
                selection.call(tip);
                circleBars = selection
                  .append("g")
                  .attr("name", (lastLayers.length - 1).toString())
                  .selectAll("path")
                  .data(allArcArray[allArcArray.length - 1])

                  .enter()
                  .append("path")
                  .attr("d", function (d) {
                    return arc(d);
                  })
                  .attr("class", "arcs")
                  .style("stroke", "none")
                  .style("stroke-width", "0.2px")
                  .style("fill", function (d, i) {
                    return circleBarsInterpolate(scales[1](avgVolumeData[i]));
                  })
                  .style("pointer-events", "auto")
                  .style("cursor", "crosshair")
                  .on("click", function () {
                    d3
                      .selectAll(".arcs")
                      .style("stroke", "steelblue")
                      .style("stroke-width", "0.2px");
                    d3
                      .select(this)
                      .style("stroke", "#B25C00")
                      .style("stroke-width", "3px");
                  })
                  .on("mouseover", tip.show)
                  .on("mouseout", tip.hide)
                  .attr(
                    "transform",
                    "translate(" +
                    transformArray[transformArray.length - 1].x +
                    "," +
                    transformArray[transformArray.length - 1].y +
                    ")"
                  );
                bars.push(circleBars);
              });

              var timeArcArray = [];
              for (var i = 0; i < 8; i++) {
                var thisArc = {};
                thisArc.startAngle = 2 * Math.PI / 8 * i;
                thisArc.endAngle = 2 * Math.PI / 8 * (i + 1);
                thisArc.innerRadius = minRadius + 4;
                thisArc.outerRadius = minRadius + 13;
                timeArcArray.push(thisArc);
              }
              var timeArc = selection
                .append("g")
                .attr("class", "timeArc")
                .selectAll("path")
                .data(timeArcArray)
                .enter()
                .append("path")
                .attr("class", "timeArcPath")
                .attr("d", function (d) {
                  return arc(d);
                })
                .style("stroke", "#F6F6F4")
                .style("stroke-opacity", 1)
                .style("fill", function (d, i) {
                  return op.timeArcColor
                })
                .style("opacity", (d, i) => {
                  if (i == 2) {
                    return op.selectedTimeArcOpacity;
                  }
                  return op.timeArcOpacity;
                })
                .style("pointer-events", "auto")
                .style("cursor", "crosshair")
                .attr(
                  "transform",
                  "translate(" +
                  transformArray[transformArray.length - 1].x +
                  "," +
                  transformArray[transformArray.length - 1].y +
                  ")"
                )
                .on("click", function (d, i) {
                  let stratTime = i * 3;
                  let endTime = i * 3 + 2;
                  timeString = stratTime.toString() + "-" + endTime.toString();
                  drawArtLine(timeString);
                  selection.selectAll(".timeArcPath").style("opacity", op.timeArcOpacity);
                  d3.select(this).style("opacity", op.selectedTimeArcOpacity);
                });

              var circle = selection
                .append("circle")
                .attr("cx", containerPoint1.x)
                .attr("cy", containerPoint1.y)
                .attr("r", minRadius)
                .attr("id", (lastLayers.length - 1).toString())
                .attr("class", "svgCircle")
                .style("color", "none")
                .style("fill", "none")
                .style("weight", 3)
                .style("fill-opacity", "0.05")
                .style("stroke-width", "2px")
                .style("stroke-opacity", "0.7")
                .style("cursor", "move");
              circle.attr("zoomScale", map.getZoom());
              $(".leaflet-pm-icon-delete").attr("name", "false");
            }); //create 的括号

            if (firstDraw) {
              $("#randomSample").on("click", function () {
                if ($("#randomSample").is(":checked")) {
                  if (selectedMapData.length !== 0) {
                    drawArtLine(timeString, random = true);
                  }
                }
              });
              //filter slider
              $("#filterSlider").slider({
                //range:true,
                min: 0,
                max: 100,
                step: 2,
                value: 0,
                // value:[0,100],
                slide: function (event, ui) {
                  $("#amount1").val(ui.value);
                },
                stop: function (event, ui) {
                  filterRate = ui.value;
                  if (ui.value != 0) {
                    filterFlag = true;
                  } else {
                    filterFlag = false;
                  }
                  var data = scatterData;
                  let filterLength = parseInt(data.length * (ui.value / 100))
                  filterData = [];
                  for (var i = 0; i < filterLength; i++) {
                    filterData.push(scatterData[i]);
                  }
                  if (filterFlag === true) {
                    d3.select("#scatterImg").attr("src", op.img_root_path + "blank.png");
                  }
                  $("#selectedNumber").text("Selected Flows:" + filterData.length);
                  drawScatterPlot(
                    filterData,
                    op.labelColorScale,
                    scatterPlotWidth,
                    scatterPlotHeight,
                    stage,
                    scatterCircleGraphics,
                    comDetecFlag,
                    labelData = undefined,
                    filterRate
                  );
                  if (selectedMapData.length > 0) {
                    drawArtLine(timeString);
                  }
                  if (selectAllFlag == true) {
                    drawLines(filterData, comDetecFlag);
                  }
                  let sRect = $(".selection");
                  let brushX = parseFloat(sRect.attr("x"));
                  let brushY = parseFloat(sRect.attr("y"));
                  let brushWidth = parseFloat(sRect.attr("width"));
                  let brushHeight = parseFloat(sRect.attr("height"));
                  if (!isNaN(brushX)) {
                    d3
                      .selectAll(".brush")
                      .call(brush)
                      .call(brush.move, [
                        [brushX, brushY],
                        [brushX + brushWidth, brushY + brushHeight]
                      ]);
                  }
                }
              });
              $("#amount1").val($("#filterSlider").slider("value"));

              $("#sample").click(function (e) {
                sampleFlag = true;
                if (selectedMapData.length !== 0) {
                  drawArtLine(timeString);
                }
                /*getScatterData(op.getSampleFile()).then(function (value) {
                  downloadPng(value);
                })*/
                var sampleRateScale = d3
                  .scaleOrdinal()
                  .domain([40, 20, 10, 5])
                  .range([1, 2, 3, 4]);

                var methodScale = d3
                  .scaleOrdinal()
                  .domain(["0", "1", "2", "012"])
                  .range([3, 2, 1, 0]);
                var method = "";
                var sampledScatterDataFileName = op.getSampleFile();
                var edgeBtwFileName = op.folderName + "/1.csv";
                var pixelFileName = op.folderName + "/2.json";
                addhistogram(edgeBtwFileName);
                pixelView(
                  pixelFileName,
                  op.system_name,
                  pStage,
                  pixelGraphics,
                  pRenderer
                );
                getScatterData(sampledScatterDataFileName).then(function (value) {
                  sampledScatterData = value;
                  $("#linesNumberAfterSample").text("Sampled Flow Count:" + sampledScatterData.length);
                  selectedMapLines = [];
                  data = sampledScatterData;
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

                  baseshowflux(getSitesName(selectedMapLines)).then(function (volumeData) {
                    if (volumeData.length === 0) {
                      return;
                    }
                    changeVolumeArray(volumeData);
                    var hourLineNumber = getHourLineNumber(volumeData);
                    avgVolumeData = getAvgVolumeData(volumeData);
                    var scales = getArcScale(avgVolumeData, parseFloat(circle.attr("r")));
                    getArcArray(
                      volumeData,
                      avgVolumeData,
                      minRadius,
                      allArcArray,
                      scales
                    );
                    getRadarData(
                      selectedMapData,
                      scatterData,
                      sampledScatterData,
                      volumeData,
                      maxValue
                    );
                    var tip = d3
                      .tip()
                      .attr("class", "d3-tip")
                      .offset([-10, 0])
                      .html(function (d, i) {
                        return (
                          "<strong>Flow:</strong> <span style='color:red'>" +
                          d3.format(".4")(avgVolumeData[i]) +
                          "</span><br></br><strong>Line Number:</strong> <span style='color:red'>" +
                          d3.format(".4")(hourLineNumber[i]) +
                          "</span>"
                        );
                      });
                    selection.call(tip);
                    d3.selectAll("[name='" + (lastLayers.length - 1).toString() + "']").remove();

                    circleBars = selection
                      .append("g")
                      .attr("name", (lastLayers.length - 1).toString())
                      .selectAll("path")
                      .data(allArcArray[allArcArray.length - 1])

                      .enter()
                      .append("path")
                      .attr("d", function (d) {
                        return arc(d);
                      })
                      .attr("class", "arcs")
                      .style("stroke", "none")
                      .style("stroke-width", "0.2px")
                      .style("fill", function (d, i) {
                        return circleBarsInterpolate(scales[1](avgVolumeData[i]));
                      })
                      .style("pointer-events", "auto")
                      .style("cursor", "crosshair")
                      .on("click", function () {
                        d3
                          .selectAll(".arcs")
                          .style("stroke", "steelblue")
                          .style("stroke-width", "0.2px");
                        d3
                          .select(this)
                          .style("stroke", "#B25C00")
                          .style("stroke-width", "3px");
                      })
                      .on("mouseover", tip.show)
                      .on("mouseout", tip.hide)
                      .attr(
                        "transform",
                        "translate(" +
                        transformArray[transformArray.length - 1].x +
                        "," +
                        transformArray[transformArray.length - 1].y +

                        ")"
                      );
                    bars[bars.length - 1] = circleBars;
                  });
                  drawScatterPlot(
                    sampledScatterData,
                    op.labelColorScale,
                    scatterPlotWidth,
                    scatterPlotHeight,
                    stage,
                    scatterCircleGraphics,
                    comDetecFlag
                  );

                  if (selectAllFlag === true) {
                    drawLines(sampledScatterData, comDetecFlag);
                    selectedCircles = sampledScatterData;
                  } else {
                    if (!isNaN(brushX)) {
                      d3
                        .selectAll(".brush")
                        .call(brush)
                        .call(brush.move, [
                          [brushX, brushY],
                          [brushX + brushWidth, brushY + brushHeight]
                        ]);
                    }
                  }
                  $("#selectedNumber").text("Selected Flows:" + selectedCircles.length);
                });
                var index = sampleRateScale(op.sample_rate) * 4 - methodScale(method);

                var scaleArray = [];
                var maxArray1 = [12, 2779, 2, 2, 2, 65952, 600, 7039];
                var minArray1 = [2, 500, 0, 0, 0, 2000, 250, 2500];
                for (var i = 0; i < 8; i++) {
                  var linear = d3
                    .scaleLinear()
                    .domain([minArray1[i], maxArray1[i]])
                    .range([40, 120]);
                  scaleArray.push(linear);
                }
                var allRadiusArray = [];

                var radius = [];
                for (var j = 0; j < 8; j++)
                  radius.push(scaleArray[j](radarData[0][j]));
                allRadiusArray.push(radius);

                var radius = [];
                for (var j = 0; j < 8; j++)
                  radius.push(scaleArray[j](radarData[index][j]));
                allRadiusArray.push(radius);


                addRadarView(allRadiusArray, [radarData[0], radarData[index]]);

                //multidrawCircles(allSelectedMapLines, comDetecFlag);
                sampled = true;
                brush.on("start brush", brushed).on("end", brushEnded);
                brushTime = 0;
                let sRect = $(".selection");
                let brushX = parseFloat(sRect.attr("x"));
                let brushY = parseFloat(sRect.attr("y"));
                let brushWidth = parseFloat(sRect.attr("width"));
                let brushHeight = parseFloat(sRect.attr("height"));


                selectedLineGraphics.clear();
                selectedCircleGraphics.clear();
                renderer.render(stage);

                var sampledAllSelectedMapLines = [];
                for (var i = 0; i < allSelectedMapLines.length; i++) {
                  sampledAllSelectedMapLines[i] = [];
                  for (var j = 0; j < allSelectedMapLines[i].length; j++) {
                    for (var s = 0; s < sampledScatterData.length; s++) {
                      if (
                        allSelectedMapLines[i][j].source ==
                        sampledScatterData[s].source &&
                        allSelectedMapLines[i][j].target ==
                        sampledScatterData[s].target
                      ) {
                        sampledAllSelectedMapLines[i].push(allSelectedMapLines[i][j]);
                      }
                    }
                  }
                }
                allSelectedMapLines = sampledAllSelectedMapLines;
              });
            }
          }, {
            zoomDraw: false
          }
        );

        d3Overlay.addTo(map);


        function drawLines(scatterData, comDetecFlag) {
          line.clear();
          let ebtArray = [];
          let interArray = [];
          for (let i = 0; i < scatterData.length; i++) {
            //style
            if (comDetecFlag === false) {
              line.lineStyle(0.1, op.originalLineColor, op.lineOpacity);
              if (scatterData[i].ebt > 100) {
                ebtArray.push(scatterData[i]);
              }
            } else {
              if (scatterData[i].ebt > 100) {
                ebtArray.push(scatterData[i]);
              }
              line.lineStyle(0.1, op.labelColorScale(scatterData[i].label).replace("#", "0x"), op.lineOpacity);
            }
            if (comDetecFlag === false) {
              let layerSourcePoint = project(scatterData[i].scor);
              let layerTargetPoint = project(scatterData[i].tcor);
              line.moveTo(layerSourcePoint.x, layerSourcePoint.y);
              line.lineTo(layerTargetPoint.x, layerTargetPoint.y);
            } else {
              if (scatterData[i].label === -1) {
                interArray.push(scatterData[i]);
              }
            }
          }

          if (interArray.length > 0) { //说明一定绘制社区了 
            line.lineStyle(0.1, op.labelColorScale(interArray[0].label).replace("#", "0x"), op.lineOpacity);
            for (let i = 0; i < interArray.length; i++) {
              let layerSourcePoint = project(interArray[i].scor);
              let layerTargetPoint = project(interArray[i].tcor);
              line.moveTo(layerSourcePoint.x, layerSourcePoint.y);
              line.lineTo(layerTargetPoint.x, layerTargetPoint.y);
            }

            for (let i = 0; i < scatterData.length; i++) {
              if (scatterData[i].label !== -1) {
                line.lineStyle(0.1, op.labelColorScale(scatterData[i].label).replace("#", "0x"), op.lineOpacity);
                let layerSourcePoint = project(scatterData[i].scor);
                let layerTargetPoint = project(scatterData[i].tcor);
                line.moveTo(layerSourcePoint.x, layerSourcePoint.y);
                line.lineTo(layerTargetPoint.x, layerTargetPoint.y);
              }
            }
          } else if (interArray == 0 && comDetecFlag === true) {
            for (let i = 0; i < scatterData.length; i++) {
              line.lineStyle(0.1, op.labelColorScale(scatterData[i].label).replace("#", "0x"), op.lineOpacity);
              let layerSourcePoint = project(scatterData[i].scor);
              let layerTargetPoint = project(scatterData[i].tcor);
              line.moveTo(layerSourcePoint.x, layerSourcePoint.y);
              line.lineTo(layerTargetPoint.x, layerTargetPoint.y);
            }
          }
          //  line.endFill();

          /* ebtCounter={};
          ebtArray.map(e=>{
            if(ebtCounter[e.label]===undefined){
              ebtCounter[e.label]=1
            }else{
              ebtCounter[e.label]+=1;
            }
          });
           */
          console.log('ebtArray: ', ebtArray);
          console.log('op.sample_method: ', op.sample_method);
          /* if (op.sample_method === '1' || op.sample_method === '') {
            for (let i = 0; i < ebtArray.length; i++) {
                line.lineStyle(0.1, "0x000000", op.lineOpacity);
                let layerSourcePoint = project(ebtArray[i].scor);
                let layerTargetPoint = project(ebtArray[i].tcor);
                //  ////
                line.moveTo(layerSourcePoint.x, layerSourcePoint.y);
                line.lineTo(layerTargetPoint.x, layerTargetPoint.y);
              }
          } */
          leafletRenderer.render(container);
        }

        var xyScale = getScatterXYScale(
            scatterData,
            scatterPlotWidth,
            scatterPlotHeight
          ),
          xScale = xyScale[0],
          yScale = xyScale[1];

        if (firstDraw) {
          brush.on("start brush", brushed).on("end", brushEnded);
        }

        function drawBundlingLines() {
          if (stationIDLocationFile === CHIFileList[0]) {
            var bundleFile = "data/CHIBundle.csv";
          } else {
            var bundleFile = "data/BSBundle.csv";
          }
          getEdgeBundlingData(bundleFile).then(function (bundleData) {
            line.clear();
            line.lineStyle(0.1, 0x3446b0, 0.5);
            for (var i = 0; i < bundleData.length; i++) {
              let layerSourcePoint = project(bundleData[i].scor);
              let layerTargetPoint = project(bundleData[i].tcor);
              let midPoint = project(bundleData[i].midcor);
              line.moveTo(layerSourcePoint.x, layerSourcePoint.y);
              line.bezierCurveTo(
                midPoint.x,
                midPoint.y,
                midPoint.x,
                midPoint.y,
                layerTargetPoint.x,
                layerTargetPoint.y
              );
            }
            leafletRenderer.render(container);
          });
        }

        function drawMapCircle(mapData) {
          mapCircleGraphics.clear();
          for (var i = 0; i < mapData.length; i++) {
            mapCircleGraphics.beginFill(0x000, 1);
            mapCircleGraphics.drawCircle(
              project(mapData[i].stationLocation).x,
              project(mapData[i].stationLocation).y,
              mapCircleRadius
            );
            mapCircleGraphics.endFill();
          }
          leafletRenderer.render(container);
        }
        drawMapCircle(mapData);

        function brushEnded() {
          if (sampled === true && selectedCircles.length < 500) {} else if (sampled === true && selectedCircles.length > 500) {
            var array = [];
            for (var i = 0; i < 500; i++) {
              array.push(selectedCircles[i]);
            }
          }
        }

        function brushed() {
          var s = d3.event.selection,
            x1 = s[0][0],
            y1 = s[0][1],
            x2 = s[1][0],
            y2 = s[1][1];
          selectedCircles = [];
          if (sampled === true) {
            var data = sampledScatterData;
          } else if (sampled === false) {
            var data = scatterData;
          }
          if (filterFlag === true) {
            var data = filterData;
          }
          for (var i = 0; i < data.length; i++) {
            var thisPoint = data[i];
            var cx = xScale(thisPoint.x);
            var cy = yScale(thisPoint.y);
            if (cx > x1 && cx < x2 && cy > y1 && cy < y2) {
              selectedCircles.push(thisPoint);
            }
          }
          drawLines(selectedCircles, comDetecFlag);
          $("#selectedNumber").text("Selected Flows:" + selectedCircles.length);
          selectedMapCircleGraphics.clear();
        }
        var selectedSourceTarget = [];
        var selectedLineGraphics = new PIXI.Graphics();
        leafletPixiContaioner.addChild(selectedLineGraphics);

        function multidrawCircles(allSelectedMapLines, comDetecFlag) {
          var xyScale = getScatterXYScale(
              scatterData,
              scatterPlotWidth,
              scatterPlotHeight
            ),
            xScale = xyScale[0],
            yScale = xyScale[1];
          allSelectedCirclesGraphics.clear();

          for (var j = 0; j < allSelectedMapLines.length; j++) {
            for (var i = 0; i < allSelectedMapLines[j].length; i++) {
              if (comDetecFlag == false) {
                allSelectedCirclesGraphics.beginFill(selectedColor, 1);
              } else {
                allSelectedCirclesGraphics.beginFill(
                  op.labelColorScale(allSelectedMapLines[j][i].label).replace(
                    "#",
                    "0x"
                  ),
                  1
                );
              }
              allSelectedCirclesGraphics.drawCircle(
                xScale(allSelectedMapLines[j][i].x),
                yScale(allSelectedMapLines[j][i].y),
                1.5
              );
              allSelectedCirclesGraphics.endFill();
            }
          }
          renderer.render(stage);
        }

        function drawSelectedCircle(thisPointData) {
          if (sampled === false) {
            var xyScale = getScatterXYScale(
                scatterData,
                scatterPlotWidth,
                scatterPlotHeight
              ),
              xScale = xyScale[0],
              yScale = xyScale[1];
          } else if (sampled === true) {
            var xyScale = getScatterXYScale(
                sampledScatterData,
                scatterPlotWidth,
                scatterPlotHeight
              ),
              xScale = xyScale[0],
              yScale = xyScale[1];
          }
          selectedCircleGraphics.clear();
          selectedCircleGraphics.lineStyle(1, 0x373b3a, 1);
          selectedCircleGraphics.beginFill(
            op.labelColorScale(thisPointData.label).replace("#", "0x")
          );
          selectedCircleGraphics.drawCircle(
            xScale(thisPointData.x),
            yScale(thisPointData.y),
            1.5
          );
          selectedCircleGraphics.endFill();
          selectedCircleGraphics.x = 0;
          selectedCircleGraphics.y = 0;
          renderer.render(stage);
        }

        function drawSelectedLine(thisPointData) {
          selectedLineGraphics.clear();
          selectedLineGraphics.lineStyle(0.5, 0x373b3a, 0.5);
          selectedLineGraphics.beginFill(0x373b3a, 0.8);
          let layerSourcePoint = project(thisPointData.scor);
          let layerTargetPoint = project(thisPointData.tcor);
          selectedLineGraphics.moveTo(layerSourcePoint.x, layerSourcePoint.y);
          selectedLineGraphics.lineTo(layerTargetPoint.x, layerTargetPoint.y);
          selectedLineGraphics.endFill();
          leafletRenderer.render(container);
        }

        function bindPointSelectEvents() {
          d3.select("#scatterSvg").on("click", function (d) {
            var selectedCoords = d3.mouse(document.getElementById("scatterSvg"));
            var selectedX = selectedCoords[0];
            var selectedY = selectedCoords[1];
            if (sampled === false) {
              var xyScale = getScatterXYScale(
                  scatterData,
                  scatterPlotWidth,
                  scatterPlotHeight
                ),
                xScale = xyScale[0],
                yScale = xyScale[1];
            } else if (sampled === true) {
              var xyScale = getScatterXYScale(
                  sampledScatterData,
                  scatterPlotWidth,
                  scatterPlotHeight
                ),
                xScale = xyScale[0],
                yScale = xyScale[1];
            }
            if (filterFlag === true) {
              var data = filterData;
            } else if (sampled === false) {
              var data = scatterData;
            } else if (sampled === true) {
              var data = sampledScatterData;
            }
            for (var i = 0; i < data.length; i++) {
              var thisPoint = data[i];
              var cx = xScale(thisPoint.x);
              var cy = yScale(thisPoint.y);
              if (
                selectedX > cx - 1.5 &&
                selectedX < cx + 1.5 &&
                selectedY > cy - 1.5 &&
                selectedY < cy + 1.5
              ) {
                selectedSourceTarget = [thisPoint.source, thisPoint.target];
                drawSelectedCircle(thisPoint);
                drawSelectedLine(thisPoint);
                break;
              }
            }
            if (stationIDLocationFile === CHIFileList[0]) {
              showflux(selectedSourceTarget[0], selectedSourceTarget[1]).then(
                function (volumeData) {
                  flowvolumeView(volumeData[0]);
                }
              );
            } else {
              baseshowflux(selectedSourceTarget[0], selectedSourceTarget[1]).then(
                function (volumeData) {
                  flowvolumeView(volumeData[0]);
                }
              );
            }
          });
        }

        if (firstDraw) {
          unbindEvents();
          $("#comDetec").on("click", function () {
            comDetecFlag = !comDetecFlag;

            if (comDetecFlag == true) {
              addCommunityRect(
                scatterData,
                scatterSvg,
                scatterPlotWidth,
                scatterPlotHeight,
                op.labelColorScale
              );
              $(".labelRect").unbind();
              scatterSvg.selectAll(".labelRect").on("click", function (d) {
                var labelData = [];
                if (filterRate === 0) {
                  if (sampledScatterData.length > 0) {
                    for (var i = 0; i < sampledScatterData.length; i++) {
                      if (sampledScatterData[i].label == d) {
                        labelData.push(sampledScatterData[i]);
                      }
                    }
                  } else {
                    for (var i = 0; i < scatterData.length; i++) {
                      if (scatterData[i].label == d) {
                        labelData.push(scatterData[i]);
                      }
                    }
                  }
                } else {

                  for (var i = 0; i < filterData.length; i++) {
                    if (scatterData[i].label == d) {
                      labelData.push(scatterData[i]);
                    }
                  }
                }
                drawLines(labelData, comDetecFlag);

                if (filterRate === 0) {
                  if (sampledScatterData.length > 0) {
                    drawScatterPlot(
                      sampledScatterData,
                      op.labelColorScale,
                      scatterPlotWidth,
                      scatterPlotHeight,
                      stage,
                      scatterCircleGraphics,
                      comDetecFlag,
                      labelData,
                      filterRate
                    );
                  } else {
                    drawScatterPlot(
                      scatterData,
                      op.labelColorScale,
                      scatterPlotWidth,
                      scatterPlotHeight,
                      stage,
                      scatterCircleGraphics,
                      comDetecFlag,
                      labelData,
                      filterRate
                    );
                  }
                } else {
                  if (filterRate === 0) {
                    drawScatterPlot(
                      filterData,
                      op.labelColorScale,
                      scatterPlotWidth,
                      scatterPlotHeight,
                      stage,
                      scatterCircleGraphics,
                      comDetecFlag,
                      labelData,
                      filterRate
                    );
                  }
                }




              });
            } else {
              scatterSvg.selectAll(".labelRect").remove();
              scatterSvg.selectAll("text").remove();
            }

            if (sampled == true) {
              drawScatterPlot(
                sampledScatterData,
                op.labelColorScale,
                scatterPlotWidth,
                scatterPlotHeight,
                stage,
                scatterCircleGraphics,
                comDetecFlag
              );
            } else if (sampled == false) {
              drawScatterPlot(
                scatterData,
                op.labelColorScale,
                scatterPlotWidth,
                scatterPlotHeight,
                stage,
                scatterCircleGraphics,
                comDetecFlag
              );
            }
            drawLines(selectedCircles, comDetecFlag);
          });
          $("#BrushButton").on("click", function () {
            if ($("#BrushButton").attr("name") === "false") {
              selectedCircles = [];
              drawLines(selectedCircles, comDetecFlag);
              d3.select("#scatterSvg").on("click", null);
              document
                .getElementById("selectPointButton")
                .setAttribute("name", "false");
              document
                .getElementById("selectPointImg")
                .setAttribute("src", "images/selectPointClose.png");

              scatterSvg.selectAll("#markRect").remove();
              scatterSvg
                .append("g")
                .attr("class", "brush")
                .call(brush);

              document.getElementById("BrushButton").setAttribute("name", "true");
              document
                .getElementById("brushImg")
                .setAttribute("src", "images/brushOpen.png");
            } else {
              d3.selectAll(".brush").remove();
              document
                .getElementById("BrushButton")
                .setAttribute("name", "false");
              selectedCircles = [];
              drawLines(selectedCircles, comDetecFlag);
              document
                .getElementById("brushImg")
                .setAttribute("src", "images/brushClose.png");
            }
          });
          $("#selectPointButton").on("click", function () {
            if ($("#selectPointButton").attr("name") === "false") {
              if ($("#BrushButton").attr("name") === "true") {
                let sRect = $(".selection");
                let brushX = parseFloat(sRect.attr("x"));
                let brushY = parseFloat(sRect.attr("y"));
                let brushWidth = parseFloat(sRect.attr("width"));
                let brushHeight = parseFloat(sRect.attr("height"));
                if (!isNaN(brushX)) {
                  d3
                    .selectAll("#scatterSvg")
                    .append("rect")
                    .attr("x", brushX)
                    .attr("id", "markRect")
                    .attr("y", brushY)
                    .attr("height", brushHeight)
                    .attr("width", brushWidth)
                    .attr("stroke", "#000")
                    .attr("fill-opacity", 0.3)
                    .attr("shape-rendering", "crispEdges")
                    .attr("fill", "rgb(119,119,119)");
                }
                d3.selectAll(".brush").remove();
                document
                  .getElementById("BrushButton")
                  .setAttribute("name", "false");
                document
                  .getElementById("brushImg")
                  .setAttribute("src", "images/brushClose.png");
              }
              bindPointSelectEvents();
              document
                .getElementById("selectPointButton")
                .setAttribute("name", "true");
              document
                .getElementById("selectPointImg")
                .setAttribute("src", "images/selectPointOpen.png");
            } else {
              selectedLineGraphics.clear();
              selectedCircleGraphics.clear();
              leafletRenderer.render(container);
              renderer.render(stage);
              if ($("#BrushButton").attr("name") === "false") {
                d3.selectAll(".brush").remove();
                selectedCircles = sampledScatterData;
                drawLines(selectedCircles, comDetecFlag);
                scatterSvg.selectAll("#markRect").remove();
              }
              d3.select("#scatterSvg").on("click", null);
              document
                .getElementById("selectPointButton")
                .setAttribute("name", "false");
              document
                .getElementById("selectPointImg")
                .setAttribute("src", "images/selectPointClose.png");
            }
          });


          $("#reset").click(function () {
            selectAllFlag = false;
            selectedLineGraphics.clear();
            selectedCircleGraphics.clear();
            if ($("#BrushButton").attr("name") === "false") {
              selectedCircles = [];
              drawLines(selectedCircles, comDetecFlag);
            } else if ($("#BrushButton").attr("name") === "true") {
              d3
                .select(".selection")
                .transition()
                .duration(750)
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", 50)
                .attr("width", 50);
              setTimeout(function () {
                d3
                  .selectAll(".brush")
                  .call(brush)
                  .call(brush.move, [
                    [0, 20],
                    [50, 50]
                  ]);
              }, 100);
            }
            drawScatterPlot(
              scatterData,
              op.labelColorScale,
              scatterPlotWidth,
              scatterPlotHeight,
              stage,
              scatterCircleGraphics,
              comDetecFlag
            );

            d3.select("#markRect").remove();
            selectedLineGraphics.clear();
            selectedCircleGraphics.clear();
            renderer.render(stage);
            leafletRenderer.render(container);
            $("#selectedNumber").text("Selected Flows:" + selectedCircles.length);
          });

          $("#edgeBundle").on("click", function () {
            drawBundlingLines();
          });

          $("#selectAll").click(function () {
            selectAllFlag = true;
            d3
              .select(".selection")
              .transition()
              .duration(750)
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", 50)
              .attr("width", 50);
            d3.selectAll(".brush").call(brush.move, [
              [0, 0],
              [50, 50]
            ]);
            if (sampled === true) {
              drawLines(sampledScatterData, comDetecFlag);
              selectedCircles = sampledScatterData;
            } else {
              drawLines(scatterData, comDetecFlag);
              selectedCircles = scatterData;
            }
            if (filterRate !== 0) {
              drawLines(filterData, comDetecFlag);
              selectedCircles = filterData;
            }
            $("#selectedNumber").text("Selected Flows:" + selectedCircles.length);
          });
        }
        prevZoom = zoom;
        firstDraw = false;
      },
      leafletPixiContaioner);
    leafletPixiOverlay.addTo(map);

    var radarData = [
      [2.82, 2779, 0, 0.0146, 1, 63475, 575.78, 7039],

      [2.944, 2779.0, 0.66, 0.09, 1, 26678, 528.282, 3874.0],
      [5.558, 2779.0, 0.295, 0.016, 1, 26739, 599.086, 7039.0],
      [3.139, 2755.331, 0.595, 0.175, 1, 26690, 598.565, 6926.0],
      [4.842, 2755.331, 0.488, 0.147, 1, 26746, 550.793, 6926.0],

      [3.104, 2755.331, 0.776, 0.31, 1, 15545, 471.311, 3408.0],
      [9.023, 2779.0, 0.531, 0.146, 1, 15531, 604.874, 6926.0],
      [2.962, 1211.971, 0.592, 0.087, 1, 15521, 607.909, 4860.0],
      [7.338, 2755.331, 0.678, 0.242, 1, 15462, 533.046, 6926.0],

      [2.61, 1211.971, 0.741, 0.004, 1, 6207, 359.848, 3408.0],
      [20.932, 2779.0, 0.982, 0.162, 1, 6258, 607.12, 4851.0],
      [2.815, 1169.29, 1.048, 0.295, 1, 6187, 612.579, 4010.0],
      [12.487, 2779.0, 1.012, 0.156, 1, 6253, 550.434, 3874.0],

      [2.831, 2755.331, 0.727, 0.06, 1, 3496, 293.848, 3051.0],
      [34.208, 2779.0, 1.42, 0.891, 1, 3426, 609.942, 3962.0],
      [2.884, 1169.29, 1.159, 0.733, 1, 3322, 597.539, 3832.0],
      [18.022, 2779.0, 0.988, 1.072, 1, 3415, 537.882, 3874.0]
    ];
    var scaleArray = [];

    var maxArray1 = [35, 2779, 2, 2, 2, 63475, 620, 7039];
    var minArray1 = [2, 500, 0, 0, 0, 2000, 250, 2500];

    for (var i = 0; i < 8; i++) {
      var linear = d3
        .scaleLinear()
        .domain([minArray1[i], maxArray1[i]])
        .range([40, 120]);
      scaleArray.push(linear);
    }
    var allRadiusArray = [];

    var radius = [];
    for (var j = 0; j < 8; j++) radius.push(scaleArray[j](radarData[0][j]));
    allRadiusArray.push(radius);

    var radius = [];
    for (var j = 0; j < 8; j++)
      radius.push(scaleArray[j](radarData[radarData.length - 1][j]));
    allRadiusArray.push(radius);

    //original 0  40% 1-4
    addRadarView(allRadiusArray, [
      radarData[0],
      radarData[radarData.length - 1]
    ]);

    pixelView(
      "data/BS/res/BSlinedetail_label40_seq012/2.json",
      op.system_name,
      pStage,
      pixelGraphics,
      pRenderer
    );
    addhistogram("data/BS/res/BSlinedetail_label40_seq012/1.csv");
  }); //promise.then
} //load()