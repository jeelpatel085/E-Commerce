const router = require("express").Router();
const { isAdmin, checktoken } = require("../middleware/authmiddleware");

const {
  createblog,
  updateblog,
  deleteblog,
  getoneblog,
  getallblog,
  liketheblog,
  disliketheblog,
  uploadfile
} = require("../controller/blogctrl");

const upload = require('../middleware/fileupload')

router.post("/create", isAdmin, checktoken, createblog);
router.put("/isliketheblog", checktoken, liketheblog);
router.put("/disliketheblog", checktoken, disliketheblog);
router.put("/update/:id", isAdmin, checktoken, updateblog);
router.delete("/delete/:id", isAdmin, checktoken, deleteblog);
router.get("/getoneblog/:id", isAdmin, checktoken, getoneblog);
router.get("/getallblog", isAdmin, checktoken, getallblog);

router.post('/upload-images', upload.single('images'),uploadfile );

module.exports = router;
