const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: true
    },
    classes:[
        {
            classId:{
                type: ObjectId,
                ref: "Classes",
            }
        }
    ],
    students:[
        {
            studentId:{
                type: ObjectId,
                ref: "Students",
            }
        }
    ]
});