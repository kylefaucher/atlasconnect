const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Profileimg = new Schema({ 
	img: {
		data: Buffer, 
	 	contentType: String 
	},
    user_id:{
    	type: String
    }
  }
); 

module.exports = mongoose.model('Profileimg', Profileimg);