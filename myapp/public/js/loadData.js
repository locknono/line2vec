function getMapData(mapDataURL) {
  return new Promise(function(resolve, reject) {
    d3.csv(mapDataURL, (error, mapData) => {
      mapData.map(element => {
        element.stationID = parseFloat(element.stationID);
        element.stationLocation = [
          parseFloat(element.stationLat),
          parseFloat(element.stationLng)
        ];
        element.label = parseFloat(element.label);
      });
      resolve(mapData);
    });
  });
}
function getFluxData(URL) {
  return new Promise(function(resolve, reject) {
    d3.json(URL, (error, data) => {
      if (error) {
        console.error(error);
      }
      resolve(data);
    });
  });
}

function getScatterData(scatterDataURL) {
  return new Promise(function(resolve, reject) {
    d3.csv(scatterDataURL, (error, scatterData) => {
      scatterData.map(function(element) {
        element.x = parseFloat(element.x);
        element.y = parseFloat(element.y);
        element.scor = [parseFloat(element.slat), parseFloat(element.slng)];
        element.tcor = [parseFloat(element.tlat), parseFloat(element.tlng)];
        element.label = parseFloat(element.label);
        element.fre = parseFloat(element.fre);
        element.ebt = parseFloat(element.ebt);
      });
      resolve(scatterData);
    });
  });
}

function getFlData(flDataURL) {
  return new Promise(function(resolve, reject) {
    d3.json(flDataURL, (error, flData) => {
      resolve(flData);
    });
  });
}
function getPixelData(mDataURL) {
  return new Promise(function(resolve, reject) {
    d3.json(mDataURL, (error, mData) => {
      if (error) {
        console.error(error);
      }
      for (var i = 0; i < mData.length; i++) {
        for (var j = 0; j < mData[i].length; j++) {
          mData[i][j] = parseFloat(Math.log2(mData[i][j] + 1));
        }
      }
      resolve(mData);
    });
  });
}
function getEbData(ebDataURL) {
  return new Promise(function(resolve, reject) {
    d3.csv(ebDataURL, (error, ebData) => {
      ebData.map(element => {
        element.frequency = Math.log2(parseFloat(element.frequency) + 1);
        element.min = parseFloat(element.min);
        element.max = parseFloat(element.max);
      });
      resolve(ebData);
    });
  });
}
function getEdgeBundlingData(URL) {
  return new Promise(function(resolve, reject) {
    d3.csv(URL, (error, data) => {
      if (error) {
        console.error(error);
      }
      data.map(element => {
        element.x = parseFloat(element.x);
        element.y = parseFloat(element.y);
        element.scor = [parseFloat(element.slat), parseFloat(element.slng)];
        element.tcor = [parseFloat(element.tlat), parseFloat(element.tlng)];
        element.midcor = [parseFloat(element.mid_x), parseFloat(element.mid_y)];
        element.label = parseFloat(element.label);
      });
      resolve(data);
    });
  });
}
function getComnityMatrixData(URL) {
  return new Promise(function(resolve, reject) {
    d3.json(URL, (error, data) => {
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
          data[i][j] = Math.log2(data[i][j] + 1);
        }
      }
      resolve(data);
    });
  });
}

function get3hourData(URL) {
  return new Promise(function(resolve, reject) {
    d3.json(URL, (error, data) => {
      resolve(data);
    });
  });
}
