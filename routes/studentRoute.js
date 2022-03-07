const express = require("express");
const router = express.Router();

const {
    requireSignin,
    IsStudentRequesting
} = require("../controllers/authController");

const {
    studentLogin,
    studentSignup,
    joinClass,
    leaveClass
} = require("../controllers/studentController");

router.post("/login", studentLogin);
router.post("/signup", studentSignup);
router.put("/class/join/:classId", requireSignin, IsStudentRequesting, joinClass);
router.put("/class/leave/:classId", requireSignin, IsStudentRequesting, leaveClass);

module.exports = router;