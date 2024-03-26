const express = require('express');
const app = express();
const PORT = process.env.PORT || 1337;
const serverless = require("serverless-http")
const session = require("express-session");
const bcrypt = require("bcryptjs");
// const flash = require("connect-flash");


const methodOverride = require("method-override");

app.use(methodOverride('_method'));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('home page if user details are there');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const authRoutes = require("./Routes/UserRoutes");
const postRoutes = require("./Routes/TaskRoutes");
app.use(authRoutes);
app.use(postRoutes);
module.exports.handler = serverless(app);
