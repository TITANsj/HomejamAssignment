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
    instructorClass
} = require("../controllers/instructorController");

// const {
    
// } = require("../controllers/studentController");

router.post("/instructor/signup", instructorSignup);

router.post("/instructor/login", instructorLogin);

router.post("/class/create", requireSignin, whoIsRequesting, createClass);
router.put("/class/update/:classId", requireSignin, whoIsRequesting, updateClass);
router.delete("/class/delete/:classId", requireSignin, whoIsRequesting, deleteClass);
router.get("/class", requireSignin, whoIsRequesting, instructorClass);
router.get("/class/list/:classId", getClass);
router.get("/class/all", getAllClass);


module.exports = router;