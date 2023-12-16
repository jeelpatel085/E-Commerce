const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productschema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    price :{
        type:String,
        required:true,
    },
    category :{
        type:String,
        required:true,
    },
    brand :{
        type:String,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
      },
      sold: {
        type: Number,
        default: 0,
      },
  
    images :[
        {
              type: [String],
            //   url: String,
        },
    ],
    color: [],
    tags: String,
    ratings: [
        {
          star: Number,
          comment: String,
          postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      totalrating: {
        type: String,
        default: 0,
      },
    }, 
    {  timestamps: true }
);

//Export the model
module.exports = mongoose.model('products', productschema);