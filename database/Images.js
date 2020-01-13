const mongoose = require('mongoose');
const db = require('./index.js');

const imagesSchema = new Schema({
  _id: Number
  img: { data: Buffer, contentType: String },
});

const A = mongoose.model('A', schema);


const saveImage = (imgPath, accountId) => {
  var a = new A;

  a.img.data = fs.readFileSync(imgPath);
  a.img.contentType = 'image/png';
  a._id = accountId;
  a.save(function (err, a) {
    if (err) throw err;
    console.log('saved img to mongo');

}

module.exports.saveImage = removeOne;