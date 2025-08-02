const { Router } = require('express');
const fs = require('fs');
const Blog = require('../models/blog.model');
const upload = require('../services/multer');
const uploadOnCloudinary = require('../services/cloudinary');
const Comments = require('../models/comment.model');
const router = Router();

router.get('/add-blog', (req, res) => {
    if(req.user) {
        return res.render('blog',{user: req.user});
    }
    else {
        return res.render('signIn');
    }
    
})

router.post('/addBlog', upload.single('coverPhoto'), async (req, res) => {
    try {
        const localPath = req.file?.path;
        const { title, body } = req.body;
        const cloudinaryUploadedUrl = await uploadOnCloudinary(localPath);
        const blog = await Blog.create({
            title: title,
            body: body,
            coverPhoto: cloudinaryUploadedUrl,
            createdBy: req.user._id
        });
             fs.unlinkSync(req.file.path);
        return res.redirect(`/blog/showBlog/${blog._id}`);

    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
})

router.get('/showBlog/:blogId', async(req,res) => {
    const blogId = req.params.blogId;
    const blog = await Blog.findById({_id: blogId}).populate("createdBy");
    const comments = await Comments.find({commentedOn: blogId}).populate("commentedBy");
    return res.render('showBlog',{
        user: req.user,
        blog: blog,
        comments

    })

})

module.exports = router;