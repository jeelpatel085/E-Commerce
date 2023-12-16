
const router = require('express').Router();

const {checktoken,
       isAdmin} = require('../middleware/authmiddleware')


const {createuser,
       login,
       getalluser,
       getoneuser,
       deletuser,
       updateuser,
       unblockuser,
       blockuser,
       handlerefreshtoken,
       logout,
       updatepassword,
       forgotpasswordtoken,
       resetpassword,
       getwishlist,
       saveaddress,
       usercart,
       getusercart,
       emptycart,
       applycoupon,
       createorder,
       getorder,
       getallorders,
       updateorder} = require('../controller/userctrl');


router.post('/registration',createuser)
router.post('/login',login)
router.get('/handlerefreshtoken',handlerefreshtoken)
router.get('/getalluser',getalluser)
router.get('/getoneuser/:id',checktoken,isAdmin,getoneuser)
router.delete('/deletuser/:id',deletuser)
router.post('/updateuser/:id',updateuser)
router.put('/blockuser/:id',checktoken,isAdmin,blockuser)
router.put('/unblockuser/:id',checktoken,isAdmin,unblockuser)
router.put('/updatepassword',checktoken,updatepassword)
router.put('/forgotpasswordtoken',forgotpasswordtoken)
router.put('/reset-password/:token',resetpassword)
router.get('/logout',logout)
router.get('/getwishlist',checktoken,getwishlist)
router.post('/saveaddress',checktoken,saveaddress)
router.post('/cart',checktoken,usercart)  // in this function does not work the delete method check it later
router.get('/getusercart',checktoken,getusercart)  
router.post('/applycoupon',checktoken,applycoupon)  
router.delete('/emptycart',checktoken,emptycart)  
router.post('/createorder',checktoken,createorder)  
router.get('/getorder',checktoken,getorder)
router.get('/getallorder',checktoken,getallorders)
router.put('/updateorder/:id',checktoken,updateorder)




module.exports = router;