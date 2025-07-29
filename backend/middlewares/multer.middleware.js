import multer from "multer"; 
// const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for the uploaded file
    
  },
});


export const upload = multer({ storage: storage }); // Export the multer instance for use in routes


