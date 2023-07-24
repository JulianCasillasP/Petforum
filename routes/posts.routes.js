const express = require('express');
const router = express.Router();
const post = require('../models/Post.model');
const user = require('../models/User.model');



// Ruta GET para mostrar el formulario de creación de posts
router.get('/new-post', (req, res) => {
    res.render('posts/new-post');
  });

// Ruta POST para recibir los datos del formulario y crear un nuevo post
router.post('/create', (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.render('error', { error: 'Por favor, completa todos los campos.' });
  }
  
  const userId = req.session.currentUser._id;

  post.create({ title, content, category, user: userId })
    .then(() => {
      // After creating the post, use .populate() to get the user's information
      post.find({ user: userId })
        .populate('user', 'username') // Populate the 'user' field with 'username' only
        .then((posts) => {
          res.redirect('/posts'); // Redirect to the /posts route
        })
        .catch((error) => {
          res.render('error', { error: 'Hubo un error al mostrar los posts.' });
        });
    })
    .catch((error) => {
      res.render('error', { error: 'Hubo un error al guardar el post.' });
    });
});
// Ruta GET para mostrar todos los posts
router.get('/', (req, res) => {
  post.find()
    .populate('user', 'username') // Populate the 'user' field with 'username' property
    .then((posts) => {
      res.render('posts/posts', { posts });
    })
    .catch((error) => {
      res.render('error', { error });
    });
});

  // Ruta POST para eliminar un post específico
router.post('/:id/delete', (req, res) => {
    const postId = req.params.id;
  
    post.findByIdAndRemove(postId)
      .then(() => {
        res.redirect('/posts');
      })
      .catch(() => {
        res.status(500).send('An error occurred');
      });
  });

  // Ruta GET para mostrar el formulario de edición de un post
router.get('/:id/edit', (req, res) => {
    const postId = req.params.id;
  
    this.purgeost.findById(postId)
      .then((post) => {
        post.find()
          .then((post) => {
            res.render('posts/edit-post', { post });
          })
          .catch((error) => {
            res.render('posts/edit-post', { error });
          });
      })
      .catch(() => {
        res.redirect('/posts');
      });
  });
  
  // Ruta POST para actualizar los datos de un post
  router.post('/:id/edit', (req, res) => {
    const postId = req.params.id;
    const { title, content, category } = req.body;
  
    post.findByIdAndUpdate(postId, { title, content, category })
      .then(() => {
        res.redirect(`/${postId}`);
      })
      .catch(() => {
        res.redirect('/posts');
      });
  });

module.exports = router;