const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ["perdidas", "adopcion", "problemas"],
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  postImage: { type: String },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;