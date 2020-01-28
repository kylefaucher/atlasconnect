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
    },
    tags: {
    	type: Array
    }
});

module.exports = mongoose.model('Posts', Posts);