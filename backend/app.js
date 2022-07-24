const express = require('express');
const fs = require('fs');
const cors = require('cors');
const dotEnv = require('dotenv');

const pathToEnv = './.env';
if (fs.existsSync(pathToEnv)) {
  dotEnv.config(pathToEnv);
} else {
  console.log('No .env file found')
}

var indexRouter = require('./routes/index');

var app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send({ status: 'ok' })
})
app.use('/notes', indexRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
