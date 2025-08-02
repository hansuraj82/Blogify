const Comments = require("../models/comment.model");

const Router = require('express').Router;
const router = Router();

router.post('/comment/:blogId', async(req,res) => {
    const blogId = req.params.blogId;
    const user = req.user;
    const {comment} = req.body;
    const commentResponse = await Comments.create({
        comment: comment,
        commentedBy: user._id,
        commentedOn: blogId
    });
    return res.redirect(`/blog/showBlog/${blogId}`);
})

module.exports = router;