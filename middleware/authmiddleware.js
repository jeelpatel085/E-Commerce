const { verify } = require('jsonwebtoken');
const con = require('../models/schema')

module.exports = {
    checktoken: (req, res, next) => {
        
        let token = req.get('Authorization');
        
        try{
            if (token) {
                token = token.slice(7);
                verify(token, "abc1234", async(err, decoded) => {
                    if (err) {
                        res.json({
                            status: 0,
                            message: "invalid token"
                        });
                    } else {
                        const userData = await con.findById(decoded._id);
                        req.userData = userData;
                        next(); // Token is valid, proceed to the next middleware
                    }
                  })            
                }
                else {
                  res.json({
                  status: 0,
                  message: 'user not found'
                  });
                }
        }catch(err){
           console.log(err)
            res.json({message:'something went wrong'})
           
            }
       
    },

      isAdmin: async (req,res,next)=>{
        const email = req.userData 

        const data = await con.findOne(email)
        if(data.role !== 'admin'){
           res.json({message:"you are not admin"}) 
        }
        else{
            next();
        }
      }
     





};