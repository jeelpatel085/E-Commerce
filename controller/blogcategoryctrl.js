const bcategory = require('../models/blogcategoryschema');
require('../config/database')


const createblogcategory = async (req, res) => {
  const data = await new bcategory(req.body);
  const result = await data.save();
  res.json({
    message: "data Inserted",
    result,
  });
};

const updateblogcategory = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await bcategory.findByIdAndUpdate(id, req.body);
    res.json({
      message: "data updated",
    });
  } catch (error) {
    res.json(error);
  }
};

const getblogcategory = async (req, res) => {
  const data = await bcategory.find();
  res.json(data);
};

const getoneblogcategory = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await bcategory.findById(id);
    res.json(data)  
} catch (err) {
    res.json(err);
  }
};


const deleteblogcategory = async(req,res)=>{
      
  const { id } = req.params

  try{
      const data = await bcategory.findByIdAndDelete(id)        
      res.json({
        message:'data deleted'
      })
    }catch(error){
       res.json(error)
  }

}


module.exports = {
  createblogcategory,
  updateblogcategory,
  getblogcategory,
  getoneblogcategory,
  deleteblogcategory
};
