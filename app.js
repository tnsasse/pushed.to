const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressGraphQL = require('express-graphql');

const indexRouter = require('./routes/index');
const blogRouter = require('./routes/blog');
const blogAPIRouter = require('./routes/api/blog');
const githubRouter = require('./routes/api/github');

const schema = require('./data/schema');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// graphql API
app.use('/api/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: {
    request: req
  },
  pretty: process.env.NODE_ENV !== 'production',
})));

// static content
app.use(express.static(path.join(__dirname, 'public')));

// redirection for legacy content
app.use('/blogs', (req, res) => {
  res.redirect(req.url);
})

app.use('/api/github', githubRouter);
app.use('/api/blog', blogAPIRouter);

app.use('/', indexRouter);
app.use('/', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : { status: err.status };

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
