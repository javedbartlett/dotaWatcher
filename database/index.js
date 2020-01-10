const mongoose = require('mongoose');

let mongoUri

if (process.env.MONGODB_URI) {
  mongoUri = process.env.MONGODB_URI;
} else {
  mongoUri = 'mongodb://localhost/matches'
}

const db = mongoose.connect(mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

mongoose.connection.on("connected", function(){
  console.log("mongoose database connected with " + mongoUri);
});
mongoose.connection.on("error", function(err){
  console.log("Unable to connect with " +mongoUri + "error are"+ err);
});

module.exports = db;
