const router =  require('express').Router();

const {createbrand,
       updatebrand,
       getbrand,
       getonebrand,
       deletebrand} = require('../controller/brandctrl')

const { checktoken } = require('../middleware/authmiddleware')


router.post('/create',checktoken,createbrand)
router.put('/update/:id',checktoken,updatebrand)
router.get('/find',checktoken,getbrand)
router.get('/findone/:id',checktoken,getonebrand)
router.delete('/delete/:id',checktoken,deletebrand)



module.exports =  router;
