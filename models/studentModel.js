const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const studentSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
    },
    registeredClass:[
        {
            classId:{
                type: ObjectId,
                ref: "Classes"
            }
        }
    ]
});

module.exports = mongoose.model("Students", studentSchema);
