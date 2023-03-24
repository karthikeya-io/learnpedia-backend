const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        desc: {
            type: String,
            trim: true
        },
        category: {
            type: String,
            trim: true
        },
        lessons: {
            type: Array,
            default: []
        },
        price: {
            type: Number,
            required: true
        },
        educator: {
            type: ObjectId,
            ref: "User",
        },
        rating: {
            type: Number,
            default: 0,
            Range: [0, 5]
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Course", courseSchema)
