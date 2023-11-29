const multer = require('multer');


const fileFilter = (req, file, cb) => {
    // Check if the file is an image
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  };


// MULTER FUNCTION
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + "_" + Date.now() + ".jpg");
    },
});


const upload = multer({
    // limits: { fileSize: 1 * 1024 * 1024 },
    storage: storage,
    fileFilter: fileFilter
})


module.exports = upload;