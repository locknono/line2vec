function pixelView(fileName,systemName, pStage, pixelGraphics, pRenderer) {
    if (systemName === "Wenzhou") {
      var file1 = op.pixel_file;
      var file3 = fileName;
      var pixelLength = 6;
    }
    Promise.all([
      getPixelData(file1),
      getPixelData(file3)
    ]).then(function(values) {
      let pData=values[0];
      pixelGraphics.clear();
      var pMax = d3.max(values, function(d) {
        return d3.max(d, value => {
          return d3.max(value);
        });
      });
      function colorRGB2Hex(color) {
        var rgb = color.split(",");
        var r = parseInt(rgb[0].split("(")[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(")")[0]);
        var hex =
          "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
      }
      var linear = d3.scale
        .linear()
        .domain([0, pMax])
        .range([0, 1]);
      pixelGraphics.lineStyle(1, 0xfff9f6, 0.6);
      var margin = { left:7, top: 10, bottom: 40, right: 5 };
      for (var i = 0; i < pData.length; i++) {
        for (var j = 0; j < pData[i].length; j++) {
          if (pData[i][j] === 0) {
            pixelGraphics.beginFill(0xffffff);
          } else {
            pixelGraphics.beginFill(
              colorRGB2Hex(d3.interpolateBlues(linear(pData[i][j])))
            );
          }
          if (systemName === "Chicago") {
            pixelGraphics.drawRect(
              margin.left + (pixelLength+1) * i,
              margin.top + pixelLength * (pData[i].length - j),
              (pixelLength+1),
              pixelLength
            );
          } else if (systemName === "Wenzhou") {
            pixelGraphics.drawRect(
              margin.left + (pixelLength) * (pData[i].length - j),
              margin.top + pixelLength * (17 - i),
              (pixelLength),
              pixelLength
            );
          }
          pixelGraphics.endFill();
        }
      }
      for (var i = 0; i < values[1].length; i++) {
        for (var j = 0; j < values[1][i].length; j++) {
          if (values[1][i][j] === 0) {
            pixelGraphics.beginFill(0xffffff);
          } else {
            pixelGraphics.beginFill(
              colorRGB2Hex(d3.interpolateBlues(linear(values[1][i][j])))
            );
          }
          if (systemName === "Chicago") {
            pixelGraphics.drawRect(
              13 * pixelLength + margin.left + pixelLength * i,
              margin.top + pixelLength * (values[1][i].length - j),
              pixelLength,
              pixelLength
            );
          } else if (systemName === "Wenzhou") {
            pixelGraphics.drawRect(
              18 * pixelLength +
                margin.left +
                pixelLength * (values[1][i].length - j),
              margin.top + pixelLength * (16 - i),
              pixelLength,
              pixelLength
            );
          }
          pixelGraphics.endFill();
        }
      }
      
      pixelGraphics.x = 0;
      pixelGraphics.y = 0;
      pStage.addChild(pixelGraphics);
      pRenderer.render(pStage);
    });
  }
  