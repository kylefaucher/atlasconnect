const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Tag = new Schema({
    tag_id: {
        type: String
    },
    tag_color: {
        type: String
    }
}); 

module.exports = mongoose.model('Tag', Tag);