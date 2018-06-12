var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var handlebars = require('handlebars');
var exphbs = require('express-handlebars');
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    static: function (name) {
      return require('./lib/static.js').map(name);
    }
  }
});


require('./models/connect.js')
var app = express(); //生成express实例app

// view engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //加载日志中间件

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({parameterLimit: 100000,limit: '50mb', extended: true}));

app.use(cookieParser()); //加载解析cookie的中间件
app.use(express.static(path.join(__dirname, 'public'))); //设置public文件夹为存放静态文件的目录

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
