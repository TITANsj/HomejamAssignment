const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
            type: ObjectId,
            ref: "Classes",
            unique: true
        }
    ]
});

studentSchema.statics.login = async function (email, password) {
    const student = await this.findOne({email : email});
    if(student){
      const auth = await bcrypt.compare(password, student.password);
      if(auth){
          return student;
      }
      throw Error("Email and password dosenot match");
    }
    throw Error("Invalid user credentials");
};

module.exports = mongoose.model("Students", studentSchema);
