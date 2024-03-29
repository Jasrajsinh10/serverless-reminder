const users = require('../models/User');
const bcrypt = require('bcryptjs');
require('express');
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.getindex = (req, res) => {
    return res.send("home page if user details are there");
};
/*<--------------------------------------------------------  GET SIGNUP  ----------------------------------------------------->*/
exports.getsignup = async (req, res) => {
  return res.send("signup page is here");
}
/*<--------------------------------------------------------  POST SIGNUP  ----------------------------------------------------->*/
exports.postsignup = async (req, res) => {
  try {
    let newpassword = await bcrypt.hash(req.body.password, 10);
    console.log(newpassword);
    const checkuser = await users.findOne({ username: req.body.username });
    const checkemail = users.findone({ email: req.body.email });
    if (checkuser) {
      return res.status(500).send("Username already exsists");
    }
    if (checkemail) {
      return res.status(500).send("email already exsists");
    }
  
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: newpassword
    }

    const useradd = await users.insertMany(user);
    console.log(useradd);
    if (useradd) {
      return res.send("user created");
    }
    else {
      return res.send(err);
    }
  }
  catch {
    return res.send("error => ", err);
  }
}

/*<--------------------------------------------------------  GET LOGIN  ----------------------------------------------------->*/
exports.getlogin = (req, res) => {
  return res.send("Login page is here")
}

/*<--------------------------------------------------------  POST LOGIN  ----------------------------------------------------->*/
exports.postlogin = async (req, res) => {
  const checkname = await users.findOne({ username: req.body.username });
  if (checkname) {
    const checkpassword = await bcrypt.compare(req.body.password, checkname.password);
    if (checkpassword) {
      username = checkname.username;
      email = checkname.email;
      id = checkname.id;
      const token = jwt.sign(
        {username,email,id},
        process.env.JWT_SECRET_KEY,
        {expiresIn:'12h'}
      );
      const addtoken = await users.updateOne({ username: username }, { accesstoken: token });
      console.log(addtoken);
      const headers = {
      'Authorization': token,
};
      console.log(headers);
      return res.status(200).json({ token })
    }
    else {
    return res.send("password is incorrect");
  }
  }
  else {
    return res.send("username is incorrect");
  }
}

/*<--------------------------------------------------------  GET HOME  ----------------------------------------------------->*/

exports.gethome = (req, res) => {
  return res.send("this is home page getting api");
}


/*<--------------------------------------------------------  LOGOUT USER  ----------------------------------------------------->*/

exports.logout = (req, res) => {
  delete req.headers['authorization'];
  return res.send("send it to login page");
}