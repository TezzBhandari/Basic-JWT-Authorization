const express = require('express');
const logger = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const router = require('./routes');
const { notFoundError, errorHandler } = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 3005;
const Mongo_Uri = process.env.MONGO_URI;
const app = express();

const start = async () => {
  try {
    await connectDB(Mongo_Uri);
    console.log('Connected To The Database');
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
  } catch (err) {
    console.log(err);
  }
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// 404 handler
app.use(notFoundError);

// custom error handler
app.use(errorHandler);

start();
