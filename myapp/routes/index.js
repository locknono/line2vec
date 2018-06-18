var express = require("express");
var router = express.Router();
var fluxModel = require("../models/flux");
var basefluxModel = require("../models/baseflux");
var fs = require("fs");
var d3 = require("d3");
var path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {});
});

router.get("/getTraffic", function (req, res) {
  var id = req.query.id;
  var query = linecon.find({
      id: id
    }, {
      traffic: {
        $slice: [0, 1]
      }
    },
    function (err, data) {
      if (err) console.error(error);
      else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(data);
      }
    }
  );
});

router.get("/getFlux", function (req, res) {
  var source = parseInt(req.query.source);
  var target = parseInt(req.query.target);

  var query = fluxModel.find({
      track: [source, target]
    },
    function (err, data) {
      if (err) {
        console.error(error);
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(data);
      }
    }
  );
});

router.post("/getBaseFlux", function (req, res) {
  var sites = req.body.sites;

  var query = basefluxModel.find({
      track: {
        $in: sites
      }
    },
    function (err, data) {
      if (err) {
        console.error(error);
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(data);
      }
    }
  );
});

router.post("/drawArtLine", function (req, res) {
  console.log("post")
  var selectedMapData = req.body.selectedMapData;

  let trackFileName = path.resolve(__dirname, '../public/data/BS/18Data_track.json');

  let sFile=req.body.sFile;
  console.log('sFile: ', sFile);

  var data = JSON.parse(
    fs.readFileSync(trackFileName)
  );
  var timeString = req.body.timeString;
  var thisTimeAllTrack = [];
  for (var i = 0; i < data.length; i++) {
    for (var key in data[i]) {
      if (key !== timeString) {
        continue;
      }
      var originalTrack = data[i][key];
      var inCircleTrack = getInCircleTrack(originalTrack);
      if (inCircleTrack.length > 0) {
        thisTimeAllTrack.push(inCircleTrack);
      }
    }
  }
  console.log("InCircle")
  var thisTimeTrackSet = {};

  var sampledSourceTragetArray = [];
  //得到采样后的轨迹集合:
  //当前所有的轨迹，判断是否在采样后的点中，如果不在采样后的点中，

  let sampleFileName = path.resolve(__dirname, '../public/'+sFile);
  console.log('sampleFileName: ', sampleFileName);

  var sampledScatterData = d3.csvParse(
    fs
    .readFileSync(
      sampleFileName
    )
    .toString("utf-8")
  );

  sampledScatterData.map(function (element) {
    element.x = parseFloat(element.x);
    element.y = parseFloat(element.y);
    element.scor = [parseFloat(element.slat), parseFloat(element.slng)];
    element.tcor = [parseFloat(element.tlat), parseFloat(element.tlng)];
    element.label = parseFloat(element.label);
    element.fre = parseFloat(element.fre);
    element.ebt = parseFloat(element.ebt);
  });
  console.log("readFinishi")

  for (var i = 0; i < sampledScatterData.length; i++) {
    sampledSourceTragetArray.push(
      sampledScatterData[i].source + "-" + sampledScatterData[i].target
    );
    sampledSourceTragetArray.push(
      sampledScatterData[i].target + "-" + sampledScatterData[i].source
    );
  }

  console.log("stArray")

  var flag = 1;
  //thisTimeAllTrack是一个三维数组，每个元素代表一个人的轨迹，每个人的轨迹数组中的每一个元素这个人轨迹的一段
  //这一段中包含了站点的信息，顺序存储
  for (var i = 0; i < thisTimeAllTrack.length; i++) {
    for (var j = 0; j < thisTimeAllTrack[i].length; j++) {
      //thisTimeAllTrack[i][j]代表某个人的某段轨迹
      flag = 1;
      var track = [];
      for (var s = 0; s < thisTimeAllTrack[i][j].length; s++) {
        track.push(thisTimeAllTrack[i][j][s].stationID);
        if (
          //如果这段轨迹中有一个点不在采样后的数据中，就剔除这一段轨迹，否则加入trackSet中
          s != 0 &&
          inArray(
            thisTimeAllTrack[i][j][s - 1].stationID +
            "-" +
            thisTimeAllTrack[i][j][s].stationID,
            sampledSourceTragetArray
          ) === -1
        ) {
          flag = 0;
          break;
        }
      }
      if (flag === 1) {
        if (thisTimeTrackSet[track] === undefined) {
          thisTimeTrackSet[track] = 1;
        } else {
          thisTimeTrackSet[track] += 1;
        }
      }
    }
  }
  console.log("trackSet")
  var sortedKeys = Object.keys(thisTimeTrackSet).sort(function (a, b) {
    return a.split(",").length - b.split(",").length;
  });
  console.log('sortedKeys: ', sortedKeys);
  for (var i = 0; i < sortedKeys.length; i++) {
    for (var j = 0; j < sortedKeys.length; j++) {
      if (i === j) {
        continue;
      }
      var key1 = sortedKeys[i];
      var key2 = sortedKeys[j];
      if (key1.indexOf(key2) != -1) {
        thisTimeTrackSet[key2] += thisTimeTrackSet[key1];
      }
    }
  }
  var allTrack = [];
  for (var key in thisTimeTrackSet) {
    keyArray = key.split(",");
    var track = {};
    var track2 = [];
    for (var i = 0; i < keyArray.length; i++) {
      for (var j = 0; j < selectedMapData.length; j++) {
        if (keyArray[i] === selectedMapData[j].stationID) {
          track2.push([
            selectedMapData[j].stationLat,
            selectedMapData[j].stationLng
          ]);
        }
      }
    }
    track.lineCoors = track2;
    track.value = thisTimeTrackSet[key];
    allTrack.push(track);
  }

  function getInCircleTrack(originalTrack) {
    var allInCircleTrack = [];
    var inCircleTrack = [];
    var queue = new Queue();
    for (var i = 0; i < originalTrack.length; i++) {
      for (var j = 0; j < selectedMapData.length; j++) {
        if (originalTrack[i] == selectedMapData[j].stationID) {
          queue.enqueue(selectedMapData[j]);
          break;
        }
      }
      if (j == selectedMapData.length) {
        if (queue.count() < 2) {
          queue.dequeue();
        } else if (queue.count() >= 2) {
          while (!queue.empty()) {
            inCircleTrack.push(queue.dequeue());
          }
          allInCircleTrack.push(inCircleTrack);
          inCircleTrack = [];
        }
      } else if (j !== selectedMapData.length && i === originalTrack.length - 1) {
        if (queue.count() < 2) {
          queue.dequeue();
        } else if (queue.count() >= 2) {
          while (!queue.empty()) {
            inCircleTrack.push(queue.dequeue());
          }
          allInCircleTrack.push(inCircleTrack);
          inCircleTrack = [];
        }
      }
    }
    return allInCircleTrack;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  console.log("trackSetEnd");

  /*let writeFileName = path.resolve(__dirname, '../public/data/BS/track/random.json');

  fs.writeFileSync(writeFileName, JSON.stringify(thisTimeTrackSet))
  console.log("writeEnd")
  */

  var resData = {
    allTrack: allTrack,
    thisTimeTrackSet: thisTimeTrackSet,
  }
  res.json(resData);
});

router.post("/writeMetric", function (req, res) {
  let data = req.body.data;
  let directory = req.body.directory;
  fs.writeFile(directory, data, err => {
    var result = {};
    if (err) {
      result.success = false;
      result.errMsg = err;
    } else {
      result.success = true;
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(result);
  });
});

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

function inArray(value, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}
module.exports = router;