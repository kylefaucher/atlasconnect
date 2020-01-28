const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Posts = new Schema({
    tag_id: {
        type: String
    },
    tag_color: {
        type: Date
    }
}); 

module.exports = mongoose.model('Tag', Tag);