/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./configs/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const notFoundPathErrorHandler = require('./middlewares/notFoundPathErrorHandler');
const centralizedErrorsHandler = require('./middlewares/centralizedErrorsHandler');
const { PORT, MONGO_URL } = require('./configs/config');

const app = express();
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(notFoundPathErrorHandler);
app.use(centralizedErrorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
