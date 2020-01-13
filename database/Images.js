const mongoose = require('mongoose');
const db = require('./index.js');
const fs = require('fs');
const path = require('path');
const download = require('image-downloader')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

let Schema = mongoose.Schema;

const imagesSchema = new Schema({
  _id: Number,
  img: { data: Buffer, contentType: String },
});

const Images = mongoose.model('Images', imagesSchema);

const saveImage = async (imgPath, accountId) => {
  const options = {
    url: imgPath,
    dest: path.resolve(__dirname + '/imgTest/image.jpg'),
  }
  async function downloadIMG() {
    try {
      const { filename, image } = await download.image(options)
      console.log(filename)
    } catch (e) {
      console.error('ERROR WITH DOWNLOAD THING', e)
    }
  }
  await downloadIMG()

  var a = new Images;

  const doesDocumentExist = await Images.find({"_id": accountId}).exec()
  if (!doesDocumentExist.length) {
    try {
      console.log('saving image to db')
      const imageData = await readFileAsync(path.resolve(__dirname + '/imgTest/image.jpg'));
      a.img.data = imageData;
      a.img.contentType = 'image/jpg';
      a._id = accountId;
      await a.save()
      .then(a => {
        return a;
      })
      .catch(err => console.log(err))
    } catch(err) {
      console.log(err);
    }
  }
  return a;
}

const imageFetch = async (accountId) => {
  return await Images.find({"_id": accountId}).exec()
}


module.exports.saveImage = saveImage;
module.exports.imageFetch = imageFetch;