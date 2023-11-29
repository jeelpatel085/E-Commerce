
require("../config/database");

const productcon = require("../models/productschema");
const User = require('../models/schema');

// const Product = require('../productimages'); // Adjust the path



const createproduct = async (req, res) => {
  const data = await new productcon(req.body);
  const result = await data.save();
  res.json({
    message: "product data inserted",
    result,
  });
};

const getallproduct = async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // Create the Mongoose query, but don't execute it yet
  let query = productcon.find(JSON.parse(queryStr));

  // Sorting

  if (req.query.sort) {
    const sortby = req.query.sort.split(",").join(" ");
    query = query.sort(sortby);
  } else {
    query = query.sort("-createdAt");
  }

  //  select  the fields
  if (req.query.fields) {
    const fieldsby = req.query.fields.split(",").join(" ");
    query = query.select(fieldsby);
  } else {
    query = query.select("-__v");
  }

  // Pagination

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);
  try {
    const products = await query;
    res.json({
      status: "success",
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the products",
    });
  }
};

const getoneproduct = async (req, res) => {
  const { id } = req.params;
  const getoneproduct = await productcon.findById(id);
  res.json(getoneproduct);
};

const updateproduct = async (req, res) => {
  const { id } = req.params;

  const updateproduct = await productcon.findByIdAndUpdate(id, req.body);
  if (updateproduct) {
    res.json({
      message: "product updated",
    });
  } else {
    res.json({
      message: "please insert valid id in parameter",
    });
  }
};

const deleteproduct = async (req, res) => {
  const { id } = req.params;

  const deleteproduct = await productcon.findByIdAndDelete(id);
  res.json({
    message: "product deleted",
  });
};


const addtowishlist = async (req,res)=>{

  const id = req.userData;
    

  const {prodid} = req.body;

  try{
    const users = await User.findById(id);

    
    // const allWishlists = users.flatMap((item) => item.wishlist);
    const alreadyadded = users.wishlist.find((id) => id.toString() === prodid);
    
      if(alreadyadded){
         let user = await User.findByIdAndUpdate(id,
          {          
            $pull :{wishlist:prodid}      
          },
          {
             new: true
          })
        res.json(user);
       }
      else{
        let user = await User.findByIdAndUpdate(id,
          {          
            $push :{wishlist:prodid}      
          },
          {
             new: true
          })
          res.json(user)
      }

      
    }catch(error){
    res.json({
      message: "none",error 
    })
  }
}


const rating = async(req,res)=>{

    const {_id} = req.userData;

    try{
      
      const {star,prodid,comment} = req.body;
      const product = await productcon.findById(prodid);
      


      let alreadyRated = product.ratings.find(
        (ratings) => ratings.postedby.toString() === _id.toString()
        );
      
       

        if (alreadyRated == ''){
      
          const updateRating = await  productcon.updateOne(prodid,
          {
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set : {'ratings.$.star': star,'ratings.$.comment': comment}
          },
          {
            new: true,
          }
          );

          res.json(updateRating);
      }
       else {
       
        const rateProduct = await productcon.findByIdAndUpdate(
          prodid,
          {
            $push: {
              ratings: {
                star: star,
                comment: comment,
                postedby: _id,
              },
            },
          },
          {
            new: true,
          }
        );
        res.json(rateProduct);
      }

      const getallratings = await productcon.findById(prodid);
    
      let totalRating = getallratings.ratings.length;
      
      let ratingsum = getallratings.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);
        
        let actualRating = Math.round(ratingsum / totalRating);
      
        let finalproduct = await productcon.findByIdAndUpdate(
        prodid,
        {
          totalrating: actualRating,
        },
        { new: true }
      );
   
      res.json(finalproduct);

    }catch(error){

      res.json({
        message: "some error occured"
      })

    }

}


const uploadfile = async (req, res) => {

  const id = req.userData;
    
  try {
    const images = req.files;
  
     const imageUrl = images.map((item)=> item.path)
     const f = imageUrl.value;
     
    
    const { prodid } = req.body;

    // Find the existing product by ID
    const existingProduct = await productcon.findById(prodid);

    // Check if the product exists
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    existingProduct.images = existingProduct.images.concat(imageUrl);

    // Add the uploaded image URL to the images array of the existing product
    existingProduct.images.push(imageUrl);

    // Save the updated product
    const updatedProduct = await existingProduct.save();

    const imageFullPath = `https://example.com/${imageUrl}`;

    console.log(imageFullPath);
    return false;

    res.json({
      updatedProduct: { ...updatedProduct._doc, images: [imageFullPath] },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





module.exports = {
  createproduct,
  getoneproduct,
  getallproduct,
  updateproduct,
  deleteproduct,
  addtowishlist,
  rating,
  uploadfile
};
