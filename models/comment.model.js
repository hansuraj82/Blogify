const {Schema,model} = require('mongoose');

const commentSchema = new Schema({
    comment: {
        type: String,
    },
    commentedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentedOn: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }
},{
    timestamps: true
})

const Comments = model('Comments',commentSchema);

module.exports = Comments;