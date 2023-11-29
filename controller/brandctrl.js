const brand = require('../models/brandschema')

const createbrand = async (req, res) => {
  const data = await new brand(req.body);
  const result = await data.save();
  res.json({
    message: "data Inserted",
    result,
  });
};

const updatebrand = async (req, res) => {
  const { id } = req.params;
  

  try {
    const data = await brand.findByIdAndUpdate(id, req.body);
    res.json({
      message: "data updated",
    });
  } catch (error) {
    res.json(error);
  }
};

const getbrand = async (req, res) => {
  const data = await brand.find();
  res.json(data);
};

const getonebrand = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await brand.findById(id);
    res.json(data)  
} catch (err) {
    res.json(err);
  }
};


const deletebrand = async(req,res)=>{
      
  const { id } = req.params

  try{
      const data = await brand.findByIdAndDelete(id)        
      res.json({
        message:'data deleted'
      })
    }catch(error){
       res.json(error)
  }

}


module.exports = {
  createbrand,
  updatebrand,
  getbrand,
  getonebrand,
  deletebrand
};
