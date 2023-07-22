const express = require('express');
const router = express.Router();
const post = require('../models/Post.model');


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
  
    const newPost = new Post({ title, content, category });
  
    newPost.save()
      .then(() => {
        res.redirect('posts/posts');
      })
      .catch((error) => {
        res.render('error', { error: 'Hubo un error al guardar el post.' });
      });
  });
// Ruta GET para mostrar todas los posts
router.get('/', (req, res) => {
  post.find()
    .then((post) => {
      res.render('posts/posts', { post });
    })
    .catch((error) => {
      res.render('posts/posts', { error });
    });
});

  // Ruta POST para eliminar un post específico
router.post('/:id/delete', (req, res) => {
    const postId = req.params.id;
  
    Post.findByIdAndRemove(postId)
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
  
    Post.findById(postId)
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
  
    Post.findByIdAndUpdate(postId, { title, content, category })
      .then(() => {
        res.redirect(`/${postId}`);
      })
      .catch(() => {
        res.redirect('/posts');
      });
  });

module.exports = router;