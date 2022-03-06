const express = require("express");
const router = express.Router();

const {
    requireSignin,
    whoIsRequesting
} = require("../controllers/authController");

const {
    studentLogin,
    studentSignup,
} = require("../controllers/studentController");

router.post("/login", studentLogin);
router.post("/signup", studentSignup);

module.exports = router;