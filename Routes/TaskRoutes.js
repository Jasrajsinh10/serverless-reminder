const express = require("express");
const taskController =  require('../Controller/TaskController.js');
const { isLoggedIn } = require('../middleware/Auth.js');
// console.log(isLoggedIn);
const router = express.Router();
router.post('/addreminder',isLoggedIn , taskController.addReminder);
router.get('/getreminder/:id',isLoggedIn, taskController.getReminder);
router.put('/updatereminder/:taskId',isLoggedIn, taskController.updateReminder);
router.delete('/deletereminder/:taskId', isLoggedIn ,taskController.deleteReminder);
router.get('/upcomingreminder/:id', isLoggedIn ,taskController.upcomingReminder);
router.get('/sendnotification/:id', isLoggedIn ,taskController.pushNotification);

module.exports = router;