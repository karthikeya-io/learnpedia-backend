const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const educatorSchema = new mongoose.Schema( {
    createdcourses: {
        type: Array,
        default: []
    },
    description: {
        type: String,
        maxlength: 1000,
        trim: true,
    }

},
    {timestamps: true}
)

module.exports = mongoose.model("Educator", educatorSchema)
