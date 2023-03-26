const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const moduleSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        trim: true
    },
    lessons: {
        type: Array,
        default: []
    },
},
    {timestamps: true}
)

module.exports = mongoose.model("Module", moduleSchema)