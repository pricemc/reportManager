const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: { 
      type: mongoose.Schema.ObjectId, 
      ref: 'UserProfile' 
    },
  message: String,
  postedDate: { type: Date, default: Date.now },
  child: {
    type: mongoose.Schema.ObjectId, 
    ref: 'Post' 
  }
});

module.exports = mongoose.model('Posts', PostSchema);
