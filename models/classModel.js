const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const classSchema = new mongoose.schema({
    className:{
        type: String,
        required: true,
        minLength: 3
    },
    classCode:{
        type: String,
        required: true,
        minLength: 3
    },
    students:[
        {
            studentId:{
                type: ObjectId,
                ref: "Students",
            }
        }
    ],
    instructor:{
        type: ObjectId,
        ref: "Instructors",
    }
});

module.exports = mongoose.model("Classes", classSchema);