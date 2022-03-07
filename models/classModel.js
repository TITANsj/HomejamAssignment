const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const classSchema = new mongoose.Schema({
    className:{
        type: String,
        required: true,
        minLength: 3
    },
    classCode:{
        type: String,
        required: true,
        minLength: 3,
        unique: true
    },
    students:[
        {
            type: ObjectId,
            ref: "Students",
            unique:true
        }
    ],
    instructorId:{
        type: ObjectId,
        ref: "Instructors",
    }
});

module.exports = mongoose.model("Classes", classSchema);