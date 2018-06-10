function flowvolumeView(volumeData) {
    if (volumeData === undefined) {
      return;
    }
    var fvSvg = d3.select("#flowvolumeSvg");
    fvSvg
      .selectAll(".g")
      .transition(750)
      .remove();
    var minRadius = 50;
    var arcColor = d3.scaleThreshold();
    arcColor
      .domain([0, 2, 4, 8, 16, 32, 64, 128, 256, 512])
      .range([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
    var arc = d3
      .arc()
      .startAngle(function(d) {
        return d.startAngle;
      })
      .endAngle(function(d) {
        return d.endAngle;
      })
      .innerRadius(function(d) {
        return d.innerRadius;
      })
      .outerRadius(function(d) {
        return d.outerRadius;
      });
    var arcArray = [];
    for (var i = 0; i < volumeData.value.length; i++) {
      for (var j = 0; j < volumeData.value[i].length - 1; j++) {
        var thisArc = new Object();
        thisArc.startAngle = 2 * Math.PI / 24 * j;
        thisArc.endAngle = 2 * Math.PI / 24 * (j + 1);
        thisArc.innerRadius = minRadius + i * 12;
        thisArc.outerRadius = minRadius + (i + 1) * 12;
        thisArc.count = volumeData.value[i][j];
        thisArc.weekday = i;
        thisArc.hour = j;
        thisArc.total = volumeData.value[i][24];
        arcArray.push(thisArc);
      }
    }

    var arr = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512];

    var flArcsG = fvSvg.append("g").attr("class", "g");
    var flInfoG = fvSvg.append("g").attr("class", "g");

    var flColorEncodingRects = flInfoG
      .selectAll(".rect")
      .data(arr)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return (i + 1) * 27 + 13;
      })
      .attr("y", function(d, i) {
        return 318 + 12;
      })
      .attr("stroke", "white")
      .attr("stroke-width", "0.5px")
      .attr("width", "27px")
      .attr("height", "15px")
      .style("fill", function(d, i) {
        return d3.interpolateYlGnBu(arcColor(d));
      });

    var flColorText = flInfoG
      .selectAll(".flColorText")
      .data(arr)
      .enter()
      .append("text")
      .text(function(d) {
        return d;
      })
      .attr("x", function(d, i) {
        return (i + 1) * 27 + 13;
      })
      .attr("y", 338 + 16)
      .style("text-anchor", "middle")
      .style("font-size", "10px");
  
    var fl = flArcsG
      .selectAll(".path")
      .data(arcArray)
      .enter()
      .append("path")
      .attr("d", arc)
      .style("stroke", "steelblue")
      .style("stroke-width", "0.2px")
      .style("fill", function(d) {
        return d3.interpolateYlGnBu(arcColor(d.count));
      })
      .attr("transform", "translate(180,170)")
      .on("mouseover", function(d, i) {
        var days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ];
        var day = Math.floor(i / 24); //day index
        var h = i % 24; //hour index
        //Update times
        d3.select("#status g.first text.time").text(days[d.weekday]);
        d3
          .select("#status g.second text.time")
          .text(
            convert_to_ampm(d.hour) +
              " - " +
              convert_to_ampm(parseInt(d.hour) + 1)
          );
        //Update value
        d3.select("#status g.first text.value").text(d.total);
        d3.select("#status g.second text.value").text(d.count);
      }); //add event








    var day_labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var label_rad = 106;
    var rad_offset = 12;
    for (var i = 0; i < 7; i++) {
      label = day_labels[i];
      label_angle = 4.73;
      flInfoG
        .append("def")
        .append("path")
        .attr("id", "day_path" + i)
        .attr(
          "d",
          "M185 224 m" +
            label_rad * Math.cos(label_angle) +
            " " +
            label_rad * Math.sin(label_angle) +
            "H 185 323"
        );
      flInfoG
        .append("text")
        .attr("font-size", "10px")
        .append("textPath")
        .attr("xlink:href", "#day_path" + i)
        .text(label);
      label_rad += rad_offset;
    }
    
    label_rad = 138;
  
    flInfoG
      .append("def")
      .append("path")
      .attr("id", "time_path")
      .attr(
        "d",
        "M182 " + 33 + " a" + label_rad + " " + label_rad + " 0 1 1 -1 0"
      );
    for (var i = 0; i < 24; i++) {
      label_angle = (i - 6) * (2 * Math.PI / 24);
      large_arc = i < 6 || i > 18 ? 0 : 1;
      flInfoG
        .append("text")
        .append("textPath")
        .attr("font-size", "11px")
        .style("color", "black")
        .style("font-weight", "bold")
        .attr("xlink:href", "#time_path")
        .attr("startOffset", i * 100 / 24 + "%")
        .text(i);
    }
    function convert_to_ampm(h) {
      if (h == "0" || h == "24") return "Midnight";
      var suffix = "am";
      if (h > 11) suffix = "pm";
      if (h > 12) return h - 12 + suffix;
      else return h + suffix;
    }
    //add flow volume view finished
  }
  
  function flowVolumeView2(volumeDatas) {
    ////console.log(volumeDatas);
    var fvSvg = d3.select("#flowvolumeSvg");
    fvSvg
      .selectAll(".g")
      .transition(750)
      .remove();
    var arc = d3
      .arc()
      .startAngle(function(d) {
        return d.startAngle;
      })
      .endAngle(function(d) {
        return d.endAngle;
      })
      .innerRadius(function(d) {
        return d.innerRadius;
      })
      .outerRadius(function(d) {
        return d.outerRadius;
      });
    var minRadius = 50;
    var arcColor = d3.scaleThreshold();
    arcColor
      .domain([0, 2, 4, 8, 16, 32, 64, 128, 256, 512])
      .range([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
    var variance;
    for (var i = 0; i < volumeDatas.length; i++) {
      for (var s = 0; s < volumeDatas[i].value[0].length - 1; j++) {
        var avgValue;
        for (var j = 0; j < volumeDatas[i].value.length; j++) {
          avgValue += volumeDatas[i].value[j][s];
        }
        avgValue = avgValue / 7;
        volumeDatas[i].value[0][s].avgValue = avgValue;
      }
    }
    for (var i = 0; i < volumeDatas.length; i++) {
      var varianceSum = 0;
      for (var j = 0; j < volumeDatas[i].value[0].length - 1; j++) {
        var variance = 0;
        var molecule = 0;
        for (var s = 0; s < volumeDatas[i].value.length; s++) {
          var thisValue = volumeDatas[i].value[s][j];
          molecule += Math.pow(
            thisValue - volumeDatas[i].value[0][j].avgValue,
            2
          );
        }
        variance = molecule / volumeDatas[i].length;
        volumeDatas[i].value[0][s].variance = variance;
        varianceSum += variance;
        volumeDatas[i].value[0][0].varianceSum = varianceSum;
      }
    }
  
    var arcArray = [];
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 24; j++) {
        var thisArc = new Object();
  
        thisArc.startAngle = 2 * Math.PI / 24 * j;
        thisArc.endAngle = 2 * Math.PI / 24 * (j + 1);
  
        thisArc.innerRadius = minRadius + i * 12;
        thisArc.outerRadius = minRadius + (i + 1) * 12;
      }
    }
  }
  