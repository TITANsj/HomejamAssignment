const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
    password: {
        type: String,
        required: true,
        minLength: 5,
    },
    classes:[
        {
            type: ObjectId,
            ref: "Classes",
            unique: true
        }
    ]
});

instructorSchema.statics.login = async function (email, password) {
    const instructor = await this.findOne({email : email});
    if(instructor){
      const auth = await bcrypt.compare(password, instructor.password);
      if(auth){
          return instructor;
      }
      throw Error("Email and password dosenot match");
    }
    throw Error("Invalid user credentials");
};

module.exports = mongoose.model("Instructors", instructorSchema);