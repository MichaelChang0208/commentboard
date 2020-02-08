
const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    author:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
    },
});

module.exports = mongoose.model('Post', PostSchema);