const router = require("express").Router();

const {createprodcategory,
       updateprodcategory,
       getproductcategory,
       getoneproductcategory,
       deleteproductcategory} = require('../controller/prodcategoryctrl');
const { checktoken } = require("../middleware/authmiddleware");


router.post('/create',checktoken,createprodcategory)
router.put('/update/:id',checktoken,updateprodcategory)
router.get('/find',checktoken,getproductcategory)
router.get('/findone/:id',checktoken,getoneproductcategory)
router.delete('/delete/:id',checktoken,deleteproductcategory)



module.exports = router;

