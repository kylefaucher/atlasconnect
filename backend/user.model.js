const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    first_name: {
        type: String
    },
    last_name:{
    	type: String
    },
    display_name: {
        type: String
    },
    bio: {
        type: String
    },
    tags: {
    	type: Array
    },
    user_id: {
        type: String
    }
});

module.exports = mongoose.model('User', User);