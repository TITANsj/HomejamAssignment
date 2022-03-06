const Student = require("../models/studentModel.js");
const Instrutor = require("../models/instructorModel.js");
const jwt = require("jsonwebtoken");

// use this middleware to protect routes
exports.requireSignin = async (req, res, next) => {
  const tokenWithBearer = req.headers.authorization;
  if (!tokenWithBearer) {
    return next(new AppError(505, "unauthorized person"));
  }
  const bearer = tokenWithBearer.split(" ");
  const token = bearer[1];
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
          return next(
            new AppError(500, "Something went worng, Try logging again.")
          );
      } else {
        req.token = token;
        next();
      }
    });
  } else {
      return next(new AppError(500, "You must login first"));
  }
};

// use this middleware to find the user, will almost use in every request
exports.whoIsRequesting = async (req, res, next) => {
  try{
    const id = req.headers.id;
    const student = await Student.findById(id);
    if (student) {
      req.profile = student;
      next();
    } else {
      return next(
        new AppError(500, "Not authorized")
      );
    }
  } catch (err) {
    return next(new AppError(400, err.message));
  }
};
