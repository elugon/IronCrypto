const { Schema, model } = require('mongoose');
 
const commentSchema = new Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, 'Comment is required.'],      
    },
    coinComment: {
        type: String,              
      },
    commentingUser:{
        type:String
    },
    userImage:{
         type:String,
    },
  },
  {
    timestamps: true
  }
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;