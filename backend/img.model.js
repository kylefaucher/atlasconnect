const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Img = new Schema(
  { img: 
      { data: Buffer, contentType: String }
  }
); 

module.exports = mongoose.model('Img', Img);