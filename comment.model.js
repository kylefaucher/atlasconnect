const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Comment = new Schema({
    project_id: {
        type: String
    },
    user_id:{
    	type: String
    },
    textcontent: {
        type: String
    }
});

module.exports = mongoose.model('Comment', Comment);
