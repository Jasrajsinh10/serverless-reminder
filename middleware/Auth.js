const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers['authorization']; 
    if (!token) {
      return res.status(403).send("Token is required so redirect to login page");
    }

    console.log('Secret Key:', process.env.JWT_SECRET_KEY);
    
    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      const user = await User.findById(decoded.id);
    if (!user) {
      return res.send("User Not Found!");
    }

    return next();
  } catch (error) {
    console.error('Error:', error);
    return res.status(403).send("Token is not valid or is expired so redirect to login page");
  }
};
