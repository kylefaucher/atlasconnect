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
    public: {
        type: Boolean
    },
    featured: {
        type: Boolean
    },
    tags: {
    	type: Array
    },
    user_display_name: {
        type: String
    },
    user_id: {
        type: String
    }
});

module.exports = mongoose.model('Posts', Posts);