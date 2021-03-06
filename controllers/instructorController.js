const Instructor = require("../models/instructorModel.js");
const Class = require("../models/classModel.js");
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
            const token = createToken(instructor._id);
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
    } catch (err){
        return next(new AppError(400, err.message));
    }
};

exports.createClass = async (req, res, next) => {
  try{
    let {className, classCode} = req.body;
    if(!classCode || !className)
      return res.status(400).json({ Error: "Please enter all fields" });
    const instructorId = req.profile._id;
    const class1 = await new Class({ className, classCode, instructorId });
    const instructor = await Instructor.findById(instructorId); 
    instructor.classes.push(class1);
    await class1.save();
    await instructor.save();
    return res.status(201).json({ message: "success", class1 });
  } catch(err){
      return next(new AppError(400, err.message));
  }
};

exports.instructorClass = async (req, res, next) => {
  try{
    const class1 = await Class.find({ instructorId: req.profile._id });
    return res.status(201).json({ message: "success", class1 });
  } catch(err){
      return next(new AppError(400, err.message));
  }
};

exports.getAllClass = async (req, res,next) => {
  try{
    const class1 = await Class.find();
    return res.status(201).json({ message: "success", class1 });  
  } catch(err){
      return next(new AppError(400, err.message));
  }
};

exports.getClass = async (req, res, next) => {
  try{
    const id = req.params.classId;
    const class1 = await Class.findById(id);
    return res.status(201).json({ message: "success", class1 });  
  } catch(err){
      return next(new AppError(400, err.message));
  }
};

exports.updateClass = async (req, res,next) => {
  try{
    const id = req.params.classId;
    const class1 = await Class.findById(id);
    class1 = _.extend(class1, req.body);
    return res.status(201).json({ message: "Successfully Updated", class1 });  
  } catch(err){
      return next(new AppError(400, err.message));
  }
};

exports.deleteClass = async (req, res,next) => {
  try{
    const id = req.params.classId;
    const class1 = await Class.deleteOne({ _id: id });;
    return res.status(201).json({ message: "Successfully Deleted", class1 });  
  } catch(err){
      return next(new AppError(400, err.message));
  }
};

exports.addStudent = async (req, res, next) => {
  try{
    const id = req.params.classId;
    const class1 = await Class.findById(id).populate("students");
    const student = await Student.findOne({ email: req.body.email });
    await class1.students.push(student._id);
    await student.registeredClass.push(id);
    student.save();
    class1.save();
    res.status(201).json({ message: "Successfully Joined", class1 });
  } catch (err){
      return next(new AppError(400, err.message));
  }
}

exports.removeStudent = async (req, res, next) => {
  try{
    const id = req.params.classId;
    const class1 = await Class.findById(id).populate("students");
    const student = await Student.findOne({ email: req.body.email });
    await class1.students.pull({_id: student._id });
    await student.registeredClass.pull({_id: student._id});
    student.save();
    class1.save();
    res.status(201).json({ message: "Successfully Joined", class1 });
  } catch (err){
      return next(new AppError(400, err.message));
  }
}
