const Instructor = require("../models/instructorModel.js");
const AppError = require("../utilities/appError.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../utilities/createToken.js");

const validateEmail = (email) => {
    return String(email)
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

exports.instructorSignup = async (req, res, next) => {
    let { name, email, password } = req.body;
    try{
        if(!name || !email || !password)
          return res.status(500).json({ error: "Please enter all the fields"});
        if(validateEmail(email))
            email = email.toLowerCase();
          else
            return res.status(500).json({ error: "Please enter the valid email"});
        const oldInstructor = await Instructor.findOne({ email :email });
        if(oldInstructor){
          return res.status(500).json({ error: "Email already Exist"});
        }
        else{
            const instructor = await new Instructor({name, email, password});
            const salt = await bcrypt.genSalt();
            instructor.password = await bcrypt.hash(password, salt);
            await instructor.save();
            return res.status(201).json({ message: "success", token, instructor });
        }
    } catch (err){
        return next(new AppError(400, err.message));
    }
};

exports.instructorLogin = async (req, res, next) => {
    let {email, password } = req.body;
    try{
        if(!email || !password)
            return res.status(500).json({ error: "Please enter all the fields"});
        if(validateEmail(email))
            email = email.toLowerCase();
        else
            return res.status(500).json({ error: "Please enter the valid email"});
        const instructor = await Instructor.login(email, password);
        const token = createToken(instructor._id);
        return res.status(200).json({ message: "success", token, instructor });
    } catch(err){
      return next(new AppError(400, err.message));
    }
  };