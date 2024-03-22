const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb+srv://jasrajsinh:loeYIcZboRd3LltO@cluster0.326spke.mongodb.net/reminder-app");

connect
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log("Connection Unsuccessful => ", err);
  });

const userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  accesstoken: {
    type: String
  }
});

const User = mongoose.model("User", userschema);

module.exports = User;
