require("../config/database");

const pcategory = require("../models/prodcategoryschema");

const createprodcategory = async (req, res) => {
  const data = await new pcategory(req.body);
  const result = await data.save();
  res.json({
    message: "data Inserted",
    result,
  });
};

const updateprodcategory = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await pcategory.findByIdAndUpdate(id, req.body);
    res.json({
      message: "data updated",
    });
  } catch (error) {
    res.json(error);
  } 
};

const getproductcategory = async (req, res) => {
  const data = await pcategory.find();
  res.json(data);
};

const getoneproductcategory = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await pcategory.findById(id);
    res.json(data)  
} catch (err) {
    res.json(err);
  }
};1


const deleteproductcategory = async(req,res)=>{
      
  const { id } = req.params

  try{
      const data = await pcategory.findByIdAndDelete(id)        
      res.json({
        message:'data deleted'
      })
    }catch(error){
       res.json(error)
  }

}


module.exports = {
  createprodcategory,
  updateprodcategory,
  getproductcategory,
  getoneproductcategory,
  deleteproductcategory
};
