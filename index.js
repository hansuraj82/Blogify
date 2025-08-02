const express = require('express');
const app = express();
require('dotenv').config();
const userRouter = require('./Router/user.router');
const blogRoute = require('./Router/blog.route');
const commentRoute = require('./Router/comment.route');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const { authenticationOfUserToken } = require('./middleware/auth.middleware');
const Blog = require('./models/blog.model');
const User = require('./models/user.model');

const PORT = process.env.PORT || 3001;

mongoose.connect("mongodb://localhost:27017/Blogify").then(e => console.log("MongoDB connected Successfully"))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(authenticationOfUserToken('token'));



app.use('/user', userRouter);
app.use('/blog', blogRoute);
app.use('/blogComment', commentRoute);
app.use('/', async (req, res) => {
    const user = req.user ? await User.findById(req.user._id) : null;
    const blogs = await Blog.find({});
    return res.render('home', { user: user || '', blogs: blogs });
});


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));



app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})