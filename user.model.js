const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    display_name: {
        type: String
    },
    display_name: {
        type: String
    },
    bio: {
        type: String
    },
    email:{
        type: String
    },
    user_id: {
        type: String
    },
    featured_project: {
        type: String
    },
    faculty: {
        type: Boolean
    }
});

module.exports = mongoose.model('User', User);