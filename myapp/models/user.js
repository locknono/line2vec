var mongoose = require('mongoose');

// 定义Schema
trafficSchema = new mongoose.Schema({
  id:{type:Number,
        required: true
   },
   traffic:{
    type: Array
   }
});

fluxSchema = new mongoose.Schema({
    trake:{
        type:Array,
        required:true
    },
    value:{
        type:Array
    }
})
// 定义Model
var linecon= mongoose.model('linecon', trafficSchema);
var fluxModel=mongoose.model('flux_Chicago',fluxSchema);

module.exports = linecon;
module.exports = fluxModel;