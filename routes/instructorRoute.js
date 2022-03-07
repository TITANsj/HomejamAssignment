const express = require("express");
const router = express.Router();

const {
    requireSignin,
    whoIsRequesting
} = require("../controllers/authController");

const {
    instructorLogin,
    instructorSignup,
    createClass,
    getAllClass,
    getClass,
    deleteClass,
    updateClass,
    instructorClass,
    addStudent,
    removeStudent
} = require("../controllers/instructorController");

//Instructor Signup
router.post("/instructor/signup", instructorSignup);

//Instructor Login
router.post("/instructor/login", instructorLogin);

//After login routes to manage Roles/Permissions for instructors.

//Instructor can create Class using this route
router.post("/class/create", requireSignin, whoIsRequesting, createClass);

//Instructor can update class using classId
router.put("/class/update/:classId", requireSignin, whoIsRequesting, updateClass);

//Instructor can delete the class
router.delete("/class/delete/:classId", requireSignin, whoIsRequesting, deleteClass);

//Instructor can view all classes that are taught by him and his students that are in that class.
router.get("/class", requireSignin, whoIsRequesting, instructorClass);

//Instructor can add students to the class using classId and student email, if the student is registered.
router.put("/class/join/:classId", requireSignin, whoIsRequesting, addStudent);

//Instructor can remove students to the class using classId and student email, if the student is present in the class.
router.put("/class/leave/:classId", requireSignin, whoIsRequesting, removeStudent);

//Anyone can get the class details using classId
router.get("/class/list/:classId", getClass);

//Anyone can get list of all class created.
router.get("/class/all", getAllClass);


module.exports = router;