const express = require("express");
const router = express.Router();

const {
    requireSignin,
    isStudentRequesting
} = require("../controllers/authController");

const {
    studentLogin,
    studentSignup,
    joinClass,
    leaveClass,
    joinedClass
} = require("../controllers/studentController");

//Student Login
router.post("/login", studentLogin);

//Student Signup
router.post("/signup", studentSignup);

//After login routes to manage Roles/Permissions for Students.

//Students can see the list of classes they have registered for and corresponding instructors.
router.get("/class/joined", requireSignin, isStudentRequesting, joinedClass);

//Student can join the class using classId
router.put("/class/join/:classId", requireSignin, isStudentRequesting, joinClass);

//Student can leave the class using classId
router.put("/class/leave/:classId", requireSignin, isStudentRequesting, leaveClass);

module.exports = router;