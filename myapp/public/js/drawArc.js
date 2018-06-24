var map = L.map("map", {
    renderer: L.canvas()
}).setView([28.0092688, 120.658735], 14);
var osmUrl =
    "https://api.mapbox.com/styles/v1/lockyes/cjirepczz27ck2rmsc5ybf978/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9ja3llcyIsImEiOiJjamlvaDExMW8wMDQ2M3BwZm03cTViaWwwIn0.AWuS0iLz_Kbk8IOrnm6EUg",
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
map.zoomControl.remove();

var artLineStartIndex = 0;
var artLineEndIndex = 1000;
var flowSliderValue = 0;
var pos = [];
map.on('click', function (e) {
    pos.push([e.latlng.lat, e.latlng.lng]);
    console.log('[e.latlng.lat, e.latlng.lng]: ', [e.latlng.lat, e.latlng.lng]);

})

var pos = [
    [28.012890774380505, 120.65331536689774],
    [28.013118102766168, 120.65486034531659],
    [28.01001123996367, 120.6551178417197],
    [28.006752726597025, 120.65554700239161],
    [28.0031151999035, 120.66129775539501],
    [28.00341833181879, 120.6684218225485],
    [28.00660116543689, 120.66919431175789],
    [28.011451016795185, 120.6667910119953],
    [28.016376423563354, 120.66936597602665],
    [28.01954616555166, 120.6634435587545],
    [28.01543942495543, 120.65960498371504],
    [28.00182687974899, 120.6493670887163],
    [28.006222261603636, 120.6476504460287],
    [28.002496222771683, 120.64138470021904],
    [28.010377420656653, 120.64224302156285],
    [28.01508826200817, 120.64044054674088],
    [28.00781364874755, 120.67657587531454],
    [28.00182687974899, 120.67202677219241],  
    [28.006676946043598, 120.66490270503894],
    [28.00781364874755, 120.66164108393254],
    [28.022665461634933, 120.64945292085069],
    [28.026226561244727, 120.65966694484182],
    [27.99582706656591, 120.65649115586979],
    [27.994311291686518, 120.66885098322038],
    [28.002268871969473, 120.65297203836022]
];
var allTrack = [{
        lineCoors: [pos[17], pos[6]],
        value: 10
    }, {
        lineCoors: [pos[13], pos[11]],
        value: 1
    }, {
        lineCoors: [pos[2], pos[3], pos[2]],
        value: 5
    }, {
        lineCoors: [pos[4], pos[3]],
        value: 10
    }, {
        lineCoors: [pos[15], pos[14], pos[11]],
        value: 3
    }, {
        lineCoors: [pos[4], pos[19], pos[10]],
        value: 5
    },
    {
        lineCoors: [pos[23], pos[17], pos[6], pos[8], pos[9]],
        value: 8
    },
    {
        lineCoors: [pos[22], pos[24], pos[11]],
        value: 5
    },
];

var thisTimeTrackSet = {};
for (let i = 0; i < allTrack.length; i++) {
    let indices = [];
    for (let j = 0; j < allTrack[i].lineCoors.length; j++) {
        let pointIndex = pos.indexOf(allTrack[i].lineCoors[j]);
        indices.push(pointIndex);
    }
    thisTimeTrackSet[indices.toString()] = allTrack[i].value;
}
thisTimeTrackSet['17,6'] = 10;
console.log('thisTimeTrackSet: ', thisTimeTrackSet);
underMap(thisTimeTrackSet);
var circleBarsInterpolate = d3.interpolate(op.circleBarStartColor, op.circleBarEndColor);

var arc = d3
    .arc()
    .startAngle(function (d) {
        return d.startAngle;
    })
    .endAngle(function (d) {
        return d.endAngle;
    })
    .innerRadius(function (d) {
        return d.innerRadius;
    })
    .outerRadius(function (d) {
        return d.outerRadius;
    });
var minRadius = 238;

function getLineNumberScale(lineNumberArray, minRadius) {
    var max = d3.max(lineNumberArray);
    var min = d3.min(lineNumberArray);
    ////////
    //var min = 0;
    var lineNumberScale = d3
        .scaleLinear()
        .domain([min, max])
        .range([minRadius + 23, minRadius + 70]);
    return lineNumberScale;
}

var svg = d3.select("#svg");

var thisPad = 2 * Math.PI / 24;

var arcArray = [];
var lineNumberArray = [1, 1, 1, 1, 2, 4, 10, 9, 7, 4, 6, 5, 7, 4, 3, 4, 3, 7, 10, 16, 22, 15, 7, 3];
var avgVolumeData = [1, 1, 1, 1, 2, 4, 18, 13, 10, 4, 6, 5, 7, 4, 3, 3, 3, 7, 15, 16, 22, 15, 7, 3];
for (var i = 0; i < avgVolumeData.length; i++) {
    var thisArc = new Object();
    thisArc.startAngle = thisPad * i + thisPad / 12;
    thisArc.endAngle = thisPad * (i + 1) - thisPad / 12;
    thisArc.innerRadius = minRadius + 20;
    thisArc.outerRadius = getLineNumberScale(lineNumberArray, minRadius)(
        lineNumberArray[i]
    );
    arcArray.push(thisArc);
}

var scales = getArcScale(avgVolumeData, minRadius);


var timeArcArray = [];
for (var i = 0; i < 8; i++) {
    var thisArc = {};
    thisArc.startAngle = 2 * Math.PI / 8 * i;
    thisArc.endAngle = 2 * Math.PI / 8 * (i + 1);
    thisArc.innerRadius = minRadius + 4;
    thisArc.outerRadius = minRadius + 20;
    timeArcArray.push(thisArc);
}
var timeArc = svg
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
    .style("stroke", "#fff")
    .style("fill", function (d, i) {
        return op.timeArcColor;
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
        350 +
        "," +
        320 +
        ")"
    )

function getArcScale(avgVolumeData, minRadius) {
    var max = d3.max(avgVolumeData);
    //////////////
    var min = d3.min(avgVolumeData);
    //////////////

    var radiusLinear = d3
        .scaleLinear()
        .domain([min, max])
        .range([minRadius + 20, minRadius + 30]);

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

svg
    .append("g")
    .selectAll("path")
    .data(arcArray)
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
    .style("z-index", 200)
    .attr(
        "transform",
        "translate(" +
        350 +
        "," +
        320 +
        ")"
    );



var d3Overlay = L.d3SvgOverlay(
    function (selection, projection) {
        drawStraightLine(allTrack);
        selection.selectAll("circle").data(pos)
            .enter()
            .append("circle")
            .attr("cx", d => projection.latLngToLayerPoint(d).x)
            .attr("cy", d => projection.latLngToLayerPoint(d).y)
            .attr("r", 3)
            .on("mouseover", (d, i) => console.log(i))
            .style("z-index", 2);

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
            minValue = 0;
            var widthScale = d3
                .scaleLinear()
                .domain([minValue, 8])
                .range([6, 10]);
            for (let i = artLineStartIndex; i <= artLineEndIndex; i++) {
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
                    var path = lineGenarator(allTrack[i].lineCoors);
                }

                var path = selection
                    .append("path")
                    .attr("class", "artLine")
                    .attr("id", function () {
                        return "artLine" + i;
                    })
                    .attr("stroke-width", widthScale((allTrack[i].value)))
                    .attr("fill", "none")
                    .style("stroke-linecap", "round")
                    .attr("d", path);

                //set style
                var color = d3.interpolate(d3.interpolateYlGnBu(0), d3.interpolateYlGnBu(1));

                if (coorsSet.size === 2 && coors.length === 2) {
                    /*  let projectCoor1 = projection.latLngToLayerPoint(coors[0]);
                     let projectCoor2 = projection.latLngToLayerPoint(coors[1]); */
                    var colorDefs = selection.append("defs");
                    var linearGradient = colorDefs
                        .append("linearGradient")
                        .attr("id", "Gradient")
                    linearGradient
                        .append("stop")
                        .attr("offset", "0%")
                        .style("stop-color", d3.interpolateYlGnBu(0).toString());
                    linearGradient
                        .append("stop")
                        .attr("offset", "100%")
                        .style("stop-color", d3.interpolateYlGnBu(1).toString());
                    path.style("stroke", function () {
                        return "url(#" + linearGradient.attr("id") + ")"
                    })
                    //  path.style("background","-moz-linear-gradient( top,#ccc,#000)")
                } else if (coorsSet.size === 2 && coors.length > 2) {
                    var colorDefs = selection.append("defs");
                    var linearGradient = colorDefs
                        .append("linearGradient")
                        .attr("id", "Gradient")
                    linearGradient
                        .append("stop")
                        .attr("offset", "0%")
                        .style("stop-color", d3.interpolateYlGnBu(0).toString());
                    linearGradient
                        .append("stop")
                        .attr("offset", "100%")
                        .style("stop-color", d3.interpolateYlGnBu(1).toString());
                    path.style("stroke", function () {
                        return "url(#" + linearGradient.attr("id") + ")"
                    })
                }
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
                        .attr("class", "artLine")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-linejoin", "round")
                        .attr("d", function (d) {
                            //return lineJoin(d[0], d[1], d[2], d[3], 1);
                            return lineJoin(d[0], d[1], d[2], d[3], widthScale((allTrack[i].value)));
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
                    /*  if (p0) { // clip ad and dc using average of u01 and u12
                       var u01 = perp(p0, p1),
                         e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]];
                       a = lineIntersect(p1, e, a, b);
                       d = lineIntersect(p1, e, d, c);
                       
                     }
                     if (p3) { // clip ab and dc using average of u12 and u23
                       var u23 = perp(p2, p3),
                         e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]];
                       b = lineIntersect(p2, e, a, b);
                       c = lineIntersect(p2, e, d, c);
                     } */
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

                /* if (
                  allTrack[i].value >= flowSliderValue
                ) {
                  selection
                    .append("path")
                    .attr("class", "artLine")
                    .style(
                      "stroke",
                      "url(#" + linearGradient.attr("id") + ")"
                    )
                    .attr("stroke-width", widthScale((allTrack[i].value))
                    .attr("fill", "none")
                    .attr("d", lineGenarator(allTrack[i].lineCoors))
                    /* .attr("marker-start",
                      "url(#arrow)")  
                    .attr("marker-mid", d => {
                      if (allTrack[i].lineCoors.length <= 2) {
                        return "none"
                      } else {
                        return "url(#arrow)"
                      }
                    })
                    .attr("marker-end", function (d) {
                      if (allTrack[i].lineCoors.length > 2) {
                        return "none"
                      } else {
                        return "url(#arrow)"
                      }
                    }) 

                  /*   //   .attr("marker-mid", "url(#arrow)")
                    var path = d3.path();
                    for (let j = 0; j < allTrack[i].lineCoors.length; j++) {
                      if (j === 0) {
                        path.moveTo(map.latLngToLayerPoint(allTrack[i].lineCoors[0]).x, map.latLngToLayerPoint(allTrack[i].lineCoors[0]).y);

                      }
                      if (j % 3 === 0 && j !== 0) {
                        path.bezierCurveTo(map.latLngToLayerPoint(allTrack[i].lineCoors[j - 2]).x, map.latLngToLayerPoint(allTrack[i].lineCoors[j - 2]).y,
                          map.latLngToLayerPoint(allTrack[i].lineCoors[j - 1]).x, map.latLngToLayerPoint(allTrack[i].lineCoors[j - 1]).y,
                          map.latLngToLayerPoint(allTrack[i].lineCoors[j]).x, map.latLngToLayerPoint(allTrack[i].lineCoors[j]).y)
                      }
                    } */
            }
        }

    }, {
        zoomDraw: false
    }).addTo(map);