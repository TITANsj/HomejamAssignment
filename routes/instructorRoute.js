const express = require("express");
const router = express.Router();

const {
    requireSignin,
    whoIsRequesting
} = require("../controllers/authController");

const {
    instructorLogin,
    instructorSignup,
    createClass
} = require("../controllers/instructorController");

// const {
    
// } = require("../controllers/studentController");

router.post("/instructor/signup", instructorSignup);

router.post("/instructor/login", instructorLogin);

router.post("/instructor/create", requireSignin, whoIsRequesting, createClass);

module.exports = router;