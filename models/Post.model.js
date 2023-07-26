const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ["Mascotas perdidas", "Adopción", "Problemas en mascotas"],
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;