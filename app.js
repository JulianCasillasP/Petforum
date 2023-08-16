// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const cloudinary = require('cloudinary').v2;

const app = express();
app.use(express.urlencoded({ extended: true }));
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "Petforum";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// Create a middleware to pass user information to all views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.currentUser || null;
    next();
  });

  app.use(express.static('public'));
  
// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const postsRoutes = require("./routes/posts.routes");
app.use("/posts", postsRoutes);

// Configurar Cloudinary con las credenciales de .env
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
