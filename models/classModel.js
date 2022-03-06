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
    instructor: ObjectId
});

module.exports = mongoose.model("Classes", classSchema);