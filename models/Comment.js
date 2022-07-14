const { Schema, model } = require('mongoose');
 
const commentSchema = new Schema(
  // Add whichever fields you need for your app
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
/*
commentSchema.pre('save', function(next) {
  const date = new Date();
  this.date = date.toString();
  next()
});*/

const Comment = model('Comment', commentSchema);

module.exports = Comment;