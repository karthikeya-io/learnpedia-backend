const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: ObjectId,
            ref: "User",
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model("Question", questionSchema)
