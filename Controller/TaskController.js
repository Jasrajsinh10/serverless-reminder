// TaskController.js

const Task = require("../models/Task");
const User = require("../models/User");

// add task in task list
exports.addReminder = async (req, res) => {
    try {
        const createdBy = req.user.id
        const { title, description, dueDate} = req.body;
        if (!title || !description || !createdBy || !dueDate) {
            return res.status(404).send("All fields are required",err);
        }
        const task = await Task.create({ title, description, createdBy, dueDate });
      return res.status(200).json({ task });
    } catch (error) {
        return res.status(500).send("Error occurred");
    }
};

// get all reminder for user logged in
exports.getReminder = async (req, res) => {
  try {

    const data = await Task.find({_id: req.params.id }).populate('createdBy');
      

    const user = await User.findById(data[0].createdBy);

        if (!user) {
            return res.send( "User Not Found!" );
        }


        if (data.length === 0) {
            return res.status(404).send( "No data foun" );
        }
      res.json({ data, user });
    } catch (error) {
      return res.send("error => ",error);
    }
}

// update reminder details of a particular reminder
exports.updateReminder = async (req, res) => {
  try {
    const TaskId = req.params.taskId;
    const updateData = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            TaskId,
            updateData,
            { new: true }
        );
        if (updatedTask) {
            return res.json(updatedTask);
        }
        else {
            return res.status(404).send( "Task not found" );
        }
    } catch (error) {
      return res.send("error",error);
    }
}

// delete a particular reminder 
exports.deleteReminder = async (req, res) => {
    try {
        const  TaskId  = req.params.taskId;
        const deletedTask = await Task.findByIdAndDelete(TaskId);
        if (deletedTask) {
            return res.json(deletedTask);
        }
        else {
            return res.status(404).send( "Task not found" );
        }
    } catch (error) {
      return res.send("error");
    }
}

// all task which are going to have duedate today
exports.upcomingReminder = async (req, res) => {
    try {
        const userId = req.params.id;
      
        const user = await User.findById(userId)
        if (!user) {
            return res.send( "User Not Found!" );
        }
       
        const upComingTask = await Task.find({
            createdBy: userId,
            dueDate: { $gte: new Date() },
        }).populate('createdBy');
               
        if (upComingTask.length <= 0) {
            return res.send("You have no upcoming Tasks" );
        }
        res.json(upComingTask);
    } catch (error) {
        return res.status(500).send("Error occurred: " + error);
    }
}

// notifification api
exports.pushNotification = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
      
        if (!user) {
            return res.send("User Not Found!");
        }
  
        const today = new Date();

        const day = today.getDate();

        const month = today.getMonth() + 1;

        const year = today.getFullYear();
 
        //Here i am making the formattedDate format same as Date().
        
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  
        const remindingMessage = await Task.find({ createdBy: userId, dueDate: formattedDate });

        remindingMessage.forEach(async (Task) => {
            console.log(`Sending Task notification for user ${userId}: ${Task.description}`);
        })
        res.send("Notification sent successfully to console")
    } catch (error) {
      return res.send("error");
    }
}