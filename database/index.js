const mongoose = require('mongoose');
let mongoUri = 'mongodb://javedb:porky123@ds361768.mlab.com:61768/heroku_fqp98kd5'


const db = mongoose.connect(mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

module.exports = db;
