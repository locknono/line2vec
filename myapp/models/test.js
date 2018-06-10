// 1、引入`mongoose connect`
require('./connect');

// 2、引入`User` Model
var linecon = require('./user');

// 4、对数据库进行操作
var query=linecon.find({"id":2},{traffic:{$slice:[0,1]}},function(err, docs){
    if(err) console.log(err);
    console.log('查询结果：' + docs);
})

console.log(query.traffic)