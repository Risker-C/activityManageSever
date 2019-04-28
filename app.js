const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const indexRouter = require('./routes/index');
const mongoConnection = require('./model/config')

const app = express();
app.use(session({
    secret: 'chen',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60*60*1000*2 },
    store: new MongoStore({ mongooseConnection: mongoConnection})
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.get('/', function(req, res) {
//   if(req.protocol === 'https') {
//     res.status(200).send('Welcome to Safety Land!');
//   }
//   else {
//     res.status(200).send('Welcome!');
//   }
// });

app.use(function(req, res, next){
  if(req.protocol == "http"){
    res.redirect("https://"+req.hostname+req.originalUrl);
    return;
  }
  // res.locals.siteName = req.siteName;
  // res.locals.cates = req.cates;
  res.locals.user = req.session.user;
  next();
});
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log("服务器错误：",err)
});

module.exports = app;
