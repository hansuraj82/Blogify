const User = require("../models/user.model");

const { Router } = require('express');
const upload = require("../services/multer");
const uploadOnCloudinary = require("../services/cloudinary");

const router = Router();

router.get('/signup', (req, res) => {
    res.render("signUp");
});

router.get('/signin', (req, res) => {
    res.render("signIn");
})

router.post('/signup', upload.single('profile'),async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const localPath = req.file?.path;
        let cloudinaryUploadedUrl = null;
        if(localPath) {
            cloudinaryUploadedUrl = await uploadOnCloudinary(localPath)
        }
       
        const response = await User.create({
            fullName: fullName,
            email: email,
            password: password,
            ...(cloudinaryUploadedUrl && {profile: cloudinaryUploadedUrl} )
        })
        res.redirect("/user/signin");
    } catch (error) {
        res.status(500).send("signup failed")

    }

})

router.post("/signin", async(req,res) => {
    try {
        const {email,password} = req.body;
        const token = await User.matchPasswordAndGenerateToken({email,password});
        if(!token) return res.send('incorrect details');
        res.cookie("token",token);
        return res.status(200).redirect("/");
        
    } catch (error) {
       return res.render("signIn", {
        error: "Incorrect Email or Password"
       })

    }
});

router.get('/logout', async(req,res) => {
    try {
        res.clearCookie("token").redirect("/");
    } catch (error) {
        return res.render('home');
    }
})


module.exports = router;
