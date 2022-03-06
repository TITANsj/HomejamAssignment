const Student = require("../models/studentModel.js");
const AppError = require("../utilities/appError.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utilities/createToken");

const validateEmail = (email) => {
    return String(email)
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

exports.studentSignup = async (req, res, next) => {
    let { name, email, password } = req.body;
    try{
        if(!name || !email || !password)
          return res.status(500).json({ error: "Please enter all the fields"});
        if(validateEmail(email))
            email = email.toLowerCase();
          else
            return res.status(500).json({ error: "Please enter the valid email"});
        const oldStudent = await Student.findOne({ email :email });
        if(oldStudent){
          return res.status(500).json({ error: "Email already Exist"});
        }
        else{
            const student = await new Student({name, email, paswword});
            const salt = await bcrypt.genSalt();
            student.password = await bcrypt.hash(password, salt);
            await student.save();
            return res.status(201).json({ message: "success", token, student });
        }
    } catch (err){
        return next(new AppError(400, err.message));
    }
};

exports.studentLogin = async (req, res, next) => {
    let {email, password } = req.body;
    try{
      if(!email || !password)
        return res.status(500).json({ error: "Please enter all the fields"});
      if(validateEmail(email))
          email = email.toLowerCase();
        else
          return res.status(500).json({ error: "Please enter the valid email"});
      const student = await Student.login(email, password);
      const token = createToken(student._id);
      return res.status(200).json({ message: "success", token, student });
    } catch(err){
      return next(new AppError(400, err.message));
    }
  };