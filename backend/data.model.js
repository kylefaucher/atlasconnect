const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Posts = new Schema({
    message: {
        type: String
    },
    title:{
    	type: String
    },
    time: {
        type: Date
    },
    include: {
        type: Boolean
    }
});

module.exports = mongoose.model('Posts', Posts);