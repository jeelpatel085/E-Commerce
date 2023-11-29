require('../config/database')
const coupon = require('../models/couponschema');




const  createcoupon = async (req,res)=>{
    const data = await new coupon(req.body)
    const result = await data.save();

    res.json({
        message:"coupon inserted",
        result
    })
}

const updatecoupon = async (req, res) => {
    const { id } = req.params;
 
    try {
        const updatecoupon = await coupon.findByIdAndUpdate(id, req.body);
        res.json({
            message: "Coupon Updated Successfully"
            
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.json({
            message: "Something Went Wrong"
        });
    }
};



const  deletecoupon = async (req,res)=>{

    const { id } =  req.params;
   try{
    const deletecoupon = await  coupon.findByIdAndDelete(id)
    res.json({
        message:"Coupon Deleted Successfully"    
    })
   }
   catch{
    res.json({
        message:"Something Went Wrong"
    })
   }
}


const getonecoupon = async (req,res)=>{
    const { id } =  req.params;

    try{
        const getonecoupon = await coupon.findById(id);
        res.json(getonecoupon);
    }
    catch{
        res.json({
            message:"something went wrong"
        })
    }
} 



const getallcoupon = async (req,res)=>{

    const getallcoupon = await coupon.find();
    res.json(getallcoupon);
} 




module.exports = {createcoupon,
                 updatecoupon,
                 deletecoupon,
                 getonecoupon,
                 getallcoupon}