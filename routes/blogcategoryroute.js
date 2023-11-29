const router =  require('express').Router();

const {createblogcategory,
       updateblogcategory,
       getblogcategory,
       getoneblogcategory,
       deleteblogcategory} = require('../controller/blogcategoryctrl')

const { checktoken } = require('../middleware/authmiddleware')


router.post('/create',checktoken,createblogcategory)
router.put('/update/:id',checktoken,updateblogcategory)
router.get('/find',checktoken,getblogcategory)
router.get('/findone/:id',checktoken,getoneblogcategory)
router.delete('/delete/:id',checktoken,deleteblogcategory)



module.exports =  router;
