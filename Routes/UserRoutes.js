const express = require("express");
const { body } = require("express-validator");
const {isLoggedIn} = require('../middleware/usermiddleware');
const userController = require("../Controller/UserController");
const router = express.Router();

router.get("/login",isLoggedIn, userController.getlogin);

router.get("/signup",isLoggedIn, userController.getsignup);

router.post("/signup", userController.postsignup);

router.post("/login", userController.postlogin,isLoggedIn);

router.get("/logout", userController.logout);

router.get("/", isLoggedIn, userController.getindex);

module.exports = router;