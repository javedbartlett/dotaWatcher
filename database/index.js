const mongoose = require('mongoose');

let mongoUri;

if (process.env.PORT) {
  mongoUri = 'mongodb://heroku_fqp98kd5:porky123@ds361768.mlab.com:61768/heroku_fqp98kd5'
} else {
  mongoUri = 'mongodb://localhost/matches'
}

const db = mongoose.connect(mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

module.exports = db;
