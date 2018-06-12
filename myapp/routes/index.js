var express = require("express");
var router = express.Router();
var fluxModel = require("../models/flux");
var basefluxModel = require("../models/baseflux");
var fs=require('fs');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
  });
});

router.get("/getTraffic", function (req, res) {
  var id = req.query.id;
  console.log(id);
  var query = linecon.find({
      id: id
    }, {
      traffic: {
        $slice: [0, 1]
      }
    },
    function (err, data) {
      if (err) console.log(err);
      else {
        console.log("查询结果：" + data);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(data);
      }
    }
  );
});

router.get("/getFlux", function (req, res) {
  var source = parseInt(req.query.source);
  var target = parseInt(req.query.target);
  console.log(typeof source);
  var query = fluxModel.find({
    track: [source, target]
  }, function (err, data) {
    if (err) console.log(err);
    else {
      console.log("查询结果：" + data);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(data);
    }
  });
});

router.post('/getBaseFlux', function (req, res) {
  var sites = req.body.sites;
  console.log('req.body: ', req.body);
  var query = basefluxModel.find({
    "track": {
      "$in": sites
    }
  }, function (err, data) {
    if (err) console.log(err);
    else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      console.log('data: ', data);
      res.json(data);
    }
  });
});

router.post('/drawArtLine', function (req, res) {
  var selectedMapData = req.body.selectedMapData;
  console.log('req.body: ', req.body);
  var query = basefluxModel.find({
    "track": {
      "$in": sites
    }
  }, function (err, data) {
    if (err) console.log(err);
    else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      console.log('data: ', data);
      res.json(data);
    }
  });
});



router.post('/writeMetric', function (req, res) {
  let data = req.body.data;
  let directory = req.body.directory;
  console.log(data, directory);
  fs.writeFile(directory, data, (err) => {
    var result = {};
    if (err) {
      result.success = false;
      result.errMsg = err;
    } else {
      console.log('数据写入成功');
      result.success = true;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(result);
  })
})

module.exports = router;