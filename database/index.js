const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost/matches';
const db = mongoose.connect(mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

module.exports = db;
