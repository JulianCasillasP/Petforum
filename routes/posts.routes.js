const express = require('express');
const router = express.Router();
const post = require('../models/Post.model');
const Comment = require('../models/Comment.model');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


// Ruta GET para mostrar el formulario de creación de posts
router.get('/new-post', (req, res, next) => {
    res.render('posts/new-post');
  });


  // Ruta GET para mostrar todos los posts
router.get('/', (req, res, next) => {
  post.find()
  .populate("user comment")
  .populate({
    path: "comment",
    populate: {
      path: "user",
      model: "User",
    },
  })
    .then((posts) => {
      console.log(posts[0].comment)
      res.render('posts/posts', { posts });
    })
    .catch((error) => {
      next(error);
    });
});


// Ruta GET para mostrar los posts filtrados por categoría
router.get('/category/:category', (req, res, next) => {
  const category = req.params.category;
  console.log("Category Filter:", category);

  post.find({ category })
  .populate("user comment")
  .populate({
    path: "comment",
    populate: {
      path: "user",
      model: "User",
    },
  })
    .then((posts) => {
      res.render('posts/posts', { posts });
    })
    .catch((error) => {
      res.render('error', { error });
    });
});


// Ruta POST para recibir los datos del formulario y crear un nuevo post
router.post('/create', upload.single('image'), (req, res, next) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.render('error', { error: 'Por favor, completa todos los campos.' });
  }

  const userId = req.session.currentUser._id;

  // Verificamos si se proporcionó una imagen en la solicitud
  let imageName = null;
  if (req.file) {
    imageName = req.file.filename;
  }

  post.create({ title, content, category, user: userId, postImage: imageName })
    .then(() => {
      res.redirect('/posts');
    })
    .catch((error) => {
      res.render('error', { error: 'Hubo un error al mostrar los posts.' });
    });
});

// Ruta GET para mostrar un post específico por su ID
router.get('/:id', (req, res, next) => {
  const postId = req.params.id;
  let owner = false;

  post.findById(postId)
    .populate("user" )
    .then((post) => {

      if (!post) {
        return res.status(404).render('error', { error: 'El post no existe.' });
      }

      if(post.user._id == req.session.currentUser._id){
        owner = true;
      }

      res.render('posts/details-post', { post, owner });
    })
    .catch((error) => {
      console.error(error); 
      next(error);
    });
});


// Ruta GET para mostrar el formulario de edición de un post específico
router.get('/:id/edit', (req, res, next) => {
  const postId = req.params.id;

  post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).render('error', { error: 'El post no existe.' });
      }

      res.render('posts/edit-post', { post });
    })
    .catch((error) => {
      console.error(error); 
      next(error);
    });
});


// Ruta POST para actualizar los datos de un post específico
router.post('/:id/edit', (req, res, next) => {
  const postId = req.params.id;
  const { title, content} = req.body;

  post.findByIdAndUpdate(postId, { title, content })
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).render('error', { error: 'El post no existe.' });
      }
      res.redirect(`/posts/${postId}`);
    })
    .catch((error) => {
      console.error(error); 
      next(error);
    });
});


// Ruta POST para eliminar un post específico
  router.post('/:id/delete', (req, res, next) => {
  
    post.findByIdAndRemove(req.params.id)
      .then(() => {
        res.redirect('/posts');
      })
      .catch(() => {
        res.status(500).send('Ocurrió un error');
      });
});


// Ruta POST para agregar un comentario a un post específico
router.post('/:id/comment',  (req, res, next) => {
  const postId = req.params.id;
  const { content } = req.body;
  const currentUser = req.session.currentUser;

  Comment.create({ content, user: currentUser._id, post: postId })
    .then((comment) => {
      // Agrega el ID del nuevo comentario al array de comentarios del post
      return post.findByIdAndUpdate(postId, { $push: { comment: comment._id } });
    })
    .then(() => {
      res.redirect(`/posts/${postId}`);
    })
    .catch((error) => {
      console.error(error);
      res.render('error', { error: 'Hubo un error al agregar el comentario.' });
    });
});


module.exports = router;