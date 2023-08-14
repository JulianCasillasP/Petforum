// config/cloudinary.config.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


          
cloudinary.config({ 
  cloud_name: 'dplj1efgv', 
  api_key: '312736754273177', 
  api_secret: 'MBE99j3L_FeoUPDFd1cKSX0rjKk' 
});

const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png'],
    folder: 'Petforum' // The name of the folder in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  }
});

//                     storage: storage
module.exports = multer({ storage });
