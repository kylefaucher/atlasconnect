const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Posts = new Schema({
    summary: {
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
    publish: {
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
    },
    for_class: {
        type: Boolean
    },
    for_expo: {
        type: Boolean
    },
    for_space: {
        type: Boolean
    },
    classnum: {
        type: String
    },
    classdept: {
        type: String
    },
    editor_html: {
        type: String
    }
});

module.exports = mongoose.model('Posts', Posts);
