var mongoose= require('mongoose');

mongoose.set('debug', true);

var db=mongoose.connect('mongodb://localhost:27017/vis');

// db.connection.on('error',console.error.bind(console,'连接错误'));
// db.connection.on("open", function () {
//   console.log("数据库连接成功");
// });