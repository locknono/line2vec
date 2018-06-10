var mongoose = require('mongoose');

// 定义Schema
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
var fluxModel=mongoose.model('flux_chicago',fluxSchema);

module.exports = fluxModel;