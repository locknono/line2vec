function underMap(thisTimeTrackSet) {
  //console.log("thisTimeTrackSet: ", thisTimeTrackSet);
  ////console.log("thisTimeTrackSet: ", thisTimeTrackSet);


  var a = '#fff4b3'; 
  var b ='#F22613'; 
  var circleBarsInterpolate = d3.interpolate(a, b);

  var svgWidth = 700;
  var svgHeight = 160;

  var svg = d3.select("#underMapView");
  /* .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("id", "underMapView")
    .style("position", "absolute")
    .style("top", "0px")
    .style("left", "0px");
    */
  svg.selectAll(".underMapRectG").remove();
  var rectG = svg.append("g").attr("class", "underMapRectG");

  var margin = { top: 25, bottom: 10, left: 10, right: 10 };

  var sortedKeys = Object.keys(thisTimeTrackSet).sort(function(a, b) {
    // ////console.log("(a.split(", ").length-1)", a.split(",").length - 1);
    return b.split(",").length - 1 - (a.split(",").length - 1);
  });
  ////console.log('sortedKeys: ', sortedKeys);
  var maxFlow = sortedKeys[0].split(",").length;
  var minFlow = sortedKeys[sortedKeys.length - 1].split(",").length;

  ////console.log("maxFlow: ", maxFlow);

  var sortedColorKeys = Object.keys(thisTimeTrackSet).sort(function(a, b) {
    return thisTimeTrackSet[b] - thisTimeTrackSet[a];
  });
  ////console.log("sortedColorKeys: ", sortedColorKeys);
  var maxColorValue = thisTimeTrackSet[sortedColorKeys[0]];

  var minColorValue =
    thisTimeTrackSet[sortedColorKeys[sortedColorKeys.length - 1]];

  ////console.log("maxColorValue: ", maxColorValue);
  ////console.log("minColorValue: ", minColorValue);

  var maxFlow = sortedKeys[0].split(",").length;
  var minFlow = sortedKeys[sortedKeys.length - 1].split(",").length;

  var rectWidth = (svgWidth - margin.left - margin.right) / sortedKeys.length;
  var rectHeight = (svgHeight - margin.top - margin.bottom) / maxFlow;

  var startPosition = [margin.left, svgHeight - margin.bottom - rectHeight];

  var rowNumber = parseInt(
    (svgHeight - margin.bottom - margin.top) / rectHeight
  );
  var colNumber = parseInt((svgWidth - margin.left - margin.right) / rectWidth);
  svg.selectAll("line").remove();
  for (var i = 0; i < rowNumber; i++) {
    svg
      .append("line")
      .attr("x1", startPosition[0])
      .attr("y1", startPosition[1] - rectHeight * i)
      .attr("x2", svgWidth - margin.right)
      .attr("y2", startPosition[1] - rectHeight * i)
      .style("stroke", "#F5EFEC")
      .style("stroke-width", "0.5px");
  }
  for (var i = 0; i < colNumber; i++) {
    svg
      .append("line")
      .attr("x1", startPosition[0] + i * rectWidth)
      .attr("y1", svgHeight - margin.bottom)
      .attr("x2", startPosition[0] + i * rectWidth)
      .attr("y2", margin.top)
      .style("stroke", "#F5EFEC")
      .style("stroke-width", "0.5px");
  }

  var colorScale = d3
    .scaleLinear()
    .domain([minColorValue, maxColorValue])
    .range([0, 1]);

  var recordArray = [];

  var thisTimeTrackSetLength = Object.keys(thisTimeTrackSet).length;

  for (var i = 0; i < sortedKeys.length; i++) {
    var thisKey = sortedKeys[i];
    var rectArray = thisKey.split(",");
    recordArray.push([rectArray.length - 1]);
    for (var s = 0; s < rectArray.length - 1; s++) {
      var thisLineName = [rectArray[s], rectArray[s + 1]];
      //////console.log('thisLineName: ', thisLineName);
      var time = 0;
      for (var key in thisTimeTrackSet) {
        time = time + 1;
        //////console.log("thisTimeTrackSet[thisKey]",thisTimeTrackSet[thisKey]);
        //////console.log("thisTimeTrackSet[thisLineName]",thisTimeTrackSet[thisLineName]);

        ////console.log(thisLineName == key);
        if (thisTimeTrackSet.hasOwnProperty(thisLineName) == false) {
          rectArray[s] = {
            name: thisLineName,
            colorValue: thisTimeTrackSet[thisKey]
          };
        } else if (
          thisLineName == key &&
          thisTimeTrackSet[key] > thisTimeTrackSet[thisKey]
        ) {
          rectArray[s] = {
            name: thisLineName,
            colorValue: thisTimeTrackSet[key]
          };
          break;
        } else if (
          thisLineName == key &&
          thisTimeTrackSet[key] < thisTimeTrackSet[thisKey]
        ) {
          rectArray[s] = {
            name: thisLineName,
            colorValue: thisTimeTrackSet[thisKey]
          };
        } else if (thisLineName != key && time != thisTimeTrackSetLength) {
          continue;
        } else if (thisLineName != key && time == thisTimeTrackSetLength) {
          //console.log("end");
          rectArray[s] = {
            name: thisLineName,
            colorValue: thisTimeTrackSet[thisKey]
          };
        }
        ////console.log(rectArray[s].name,rectArray[s].colorValue);
      }
      //console.log("rectArray: ", rectArray);
      for (var j = 0; j < rectArray.length - 1; j++) {
        rectG
          .append("rect")
          .attr("x", startPosition[0] + i * rectWidth)
          .attr("y", startPosition[1] - j * rectHeight)
          .attr("width", rectWidth)
          .attr("height", rectHeight)
          .style("stroke", "none")
          .style("fill", function(d) {
            ////console.log("colorScale(rectArray[j].colorValue)",colorScale(rectArray[j].colorValue));
            return circleBarsInterpolate(colorScale(rectArray[j].colorValue));
          });
      }
    }
  }

  return recordArray;
}


