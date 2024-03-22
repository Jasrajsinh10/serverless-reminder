const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    console.log('Token:', token);

    if (!token) {
      return next();
    }

    console.log('Secret Key:', process.env.JWT_SECRET_KEY);
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    }
    catch(error){
      if (error) {
        return next();
      }
    }
    console.log("1");
    req.user = decoded;

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.send("User Not Found! so go to signup page because user data is deleted");
    }
    else {
      return res.send("Going to home page");
    }

    
  } catch (error) {
    console.error('Error:', error);
    return res.status(403).send("Token is not valid or is expired");
  }
};
