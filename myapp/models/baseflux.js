var mongoose = require('mongoose');

basefluxSchema = new mongoose.Schema({
    track:{
        type:String,
        required:true
    },
    value:{
        type:Array
    }
})

var basefluxModel=mongoose.model('flux_wenzhou',basefluxSchema,"flux_wenzhou");
module.exports = basefluxModel;