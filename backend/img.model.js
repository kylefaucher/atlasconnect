const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Img = new Schema({ 
	img: {
		data: Buffer, 
	 	contentType: String 
	},
    project_id:{
    	type: String
    }
  }
); 

module.exports = mongoose.model('Img', Img);