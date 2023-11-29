const router = require("express").Router();
const {checktoken,isAdmin} = require('../middleware/authmiddleware')

const {
  createproduct,
  getoneproduct,
  getallproduct,
  updateproduct,
  deleteproduct,
  addtowishlist,
  rating,
  uploadfile
} = require("../controller/productctrl");

const upload = require('../middleware/fileupload')

router.post("/", checktoken,isAdmin,createproduct);
router.get("/getoneproduct/:id", getoneproduct);
router.get("/getallproduct", getallproduct);
router.post("/updateproduct/:id", checktoken,isAdmin,updateproduct);
router.post("/deleteproduct/:id", checktoken,isAdmin,deleteproduct);
router.put('/addtowishlist',checktoken,addtowishlist)
router.put('/rating',checktoken,rating)

router.post('/upload-images', upload.array('images', 5),uploadfile );


module.exports = router;
