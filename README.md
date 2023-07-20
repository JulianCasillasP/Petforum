# Petforum
Developed as the second project of my bootcamp at Ironhack Barcelona.

## About
Welcome to our Petforum, spearheaded by Julian, in this second project. This platform is a haven for pet owners seeking to share, inquire, and connect with others who've experienced similar situations. Share and seek lost pets, discuss pet issues for advice and improvement, and explore opportunities for pet adoption.

## Deployment
You can check the app fully deployed [here]

## Work structure

## Installation guide
- Fork this repo
- Clone this repo 

```shell
$ cd Petforum
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  isAdmin: Boolean,
});
```
#### Post.model.js
```js
const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ["Lost Pets", "Adoption", "Issues"],
    required: true,},
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});
```
#### Comment.model.js
```js
const commentSchema = new Schema({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now },
});
```

## User roles
| Role  | Capabilities                                                                                                                                 | Property                         |
| :---: | ---------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| User  | Can log in/log out. Can read all posts. Can create a new post. Can read all comments. Can create a new comment. Can edit their own posts and comments.| isAdmin: false                   |
| Admin | Can log in/log out. Can read, edit, or delete all posts/comments. Can create a new post.                                                     | isAdmin: true                    |

## Routes
| Method | Endpoint                    | Require                                             | Action                                                                                     
| :----: | --------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------
| POST   | /signup                     | const { username, email, password } = req.body      | Register the user in the database and redirect to the login page.                          
| POST   | /login                      | const { email, password } = req.body                | Log in with a registered user and redirect to the home page.                               
| GET    | /post/all                   | -                                                   | Return an array with all the registered posts.                                             
| GET    | /posts/:postId	             | const { postId } = req.params                       | Return the information of the specified post.                                              
| POST   | /posts/new                  | const { title, content, category } = req.body       | Create a new post in the database and redirect to the post page.                           
| POST   | /posts/:postId/edit         | const { postId } = req.params                       | Edit an existing post in the database and redirect to the updated post page.               
| POST   | /posts/:postId/delete       | const { postId } = req.params                       | Delete a post from the database and redirect to the home page or post list.                
| POST   | /posts/:postId/new          | const { content, postId } = req.body                | Add a new comment to the specified post and redirect to the post page with the new comment.
| POST   | /posts/:postId/:idComment/edit | const { commentId } = req.params                    | Edit an existing comment and redirect to the post page with the edited comment.            
| POST | /posts/:postId/:idComment/delete | const { commentId } = req.params                    | Delete a comment and redirect to the post page without the deleted comment.                
---
