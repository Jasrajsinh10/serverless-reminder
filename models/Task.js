const mongoose = require("mongoose");
const User = require("./User"); // Import the User model

const connect = mongoose.connect("mongodb+srv://jasrajsinh:loeYIcZboRd3LltO@cluster0.326spke.mongodb.net/reminder-app");

connect
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log("Connection Unsuccessful => ", err);
  });

const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referring to the 'User' model
  },
  dueDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
