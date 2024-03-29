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
        return res.json(upComingTask);
    } catch (error) {
        return res.status(500).send("Error occurred: " + error);
    }
}

// notifification api
exports.pushNotification = async (req, res) => {
   const nodemailer = require('nodemailer');

try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    console.log(userId);
    if (!user) {
        return res.send("User Not Found!");
    }
    console.log("21")

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    console.log("22")
    // Format today's date as YYYY-MM-DD
    // const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    const formattedDate = '2024-03-28T00:00:00.000+00:00'
    console.log(formattedDate)

    // Find tasks with due date equal to today's date
    const remindingTasks = await Task.find({ createdBy: userId, dueDate: formattedDate });
    console.log(remindingTasks)
    
    // Check if there are any tasks due today
    if (remindingTasks.length > 0) {
        // Configure nodemailer transporter with your email service provider details
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jasrajsinh123@gmail.com',
                pass: 'ayxktnhejgllrzva'
            }
        });
    console.log("25")

        // Define email options
        const mailOptions = {
            from: 'jasrajsinh123@gmail.com',
            to: 'mohits@zignuts.com', // Send notification to the user's email address
            subject: 'Today\'s Task Reminder',
            text: remindingTasks.map(task => task.description).join('\n') // Combine task descriptions into email body
        };
    console.log("26")

        // Send the email
        await transporter.sendMail(mailOptions);
            console.log("27")

        console.log(`Notification sent to ${user.email}`);
        return res.send("Notification sent successfully");
    } else {
        return res.send("No tasks due today");
    }
} catch (error) {
    console.error("Error:", error);
    return res.status(500).send("An error occurred");
}

}