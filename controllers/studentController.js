const Student = require("../models/studentModel.js");
const Class = require("../models/classModel.js");
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
            const student = await new Student({name, email, password});
            const token = createToken(student._id);
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

exports.joinedClass = async (req, res, next) => {
  try{
    const class1 = await Class.find({ students: req.profile._id });
    return res.status(201).json({ message: "success", class1 });
  } catch(err){
      return next(new AppError(400, err.message));
  }
};

exports.joinClass = async (req, res, next) => {
  try{
    const id = req.params.classId;
    const class1 = await Class.findById(id).populate("students");
    const student = await Student.findById(req.profile._id);
    await class1.students.push(req.profile._id);
    await student.registeredClass.push(id);
    student.save();
    class1.save();
    res.status(201).json({ message: "Successfully Joined", class1 });
  } catch (err){
      return next(new AppError(400, err.message));
  }
};

exports.leaveClass = async (req, res, next) => {
  try{
    const id = req.params.classId;
    const class1 = await Class.findById(id).populate("students");
    const student = await Student.findById(req.profile._id);
    await class1.students.pull({_id: req.profile._id});
    await student.registeredClass.pull({_id: id});
    class1.save();
    student.save();
    res.status(201).json({ message: "Successfully Left", class1});
  } catch (err){
      return next(new AppError(400, err.message));
  }
};