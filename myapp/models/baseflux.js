var mongoose = require('mongoose');

// 定义Schema
basefluxSchema = new mongoose.Schema({
    track:{
        type:String,
        required:true
    },
    value:{
        type:Array
    }
})
// 定义Model
var basefluxModel=mongoose.model('flux_wenzhou',basefluxSchema);

module.exports = basefluxModel;