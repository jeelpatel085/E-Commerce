
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
       resetpassword} = require('../controller/userctrl');


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






module.exports = router;    