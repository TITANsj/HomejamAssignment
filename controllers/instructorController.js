const Instructor = require("../models/instructorModel.js");
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

exports.instructorSignup = async (req, res) => {
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
            const instructor = await new Instructor({name, email, paswword});
            const salt = await bcrypt.genSalt();
            company.paswword = await bcrypt.hash(password, salt);
            await company.save();
            return res.status(201).json({ message: "success", token, instructor });
        }
    } catch (err){
        return next(new AppError(400, err.message));
    }
};