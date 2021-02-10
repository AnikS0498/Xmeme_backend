const mongoose = require("mongoose");

//meme schema
const MemeSchema = mongoose.Schema({
    // id:{
    //     type: Number,
    //     required: true
    // },
    memeOwner: {
        type: String,
        required: true
    },
    memeCaption: {
        type: String,
        required: true
    },
    memeUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Meme', MemeSchema);
