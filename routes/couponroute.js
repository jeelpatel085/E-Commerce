const router = require('express').Router();
const {createcoupon,
    updatecoupon,
    deletecoupon,
    getonecoupon,
    getallcoupon} = require('../controller/couponctrl');
const { checktoken } = require('../middleware/authmiddleware');


router.post('/createcoupon',checktoken,createcoupon)
router.put('/updatecoupon/:id',checktoken,updatecoupon)
router.delete('/deletecoupon/:id',checktoken,deletecoupon)
router.get('/getonecoupon/:id',checktoken,getonecoupon)
router.get('/getallcoupon',checktoken,getallcoupon)




module.exports = router;