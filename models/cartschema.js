const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products:[
      {
        product:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:"products"
        },
        count: Number,
        color: String,
        price: Number  
       } 
    ],
    carttotal: Number,
    totalAfterDiscount: Number,
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

},
{
  timestamps: true

}

);

//Export the model
module.exports = mongoose.model('carts', cartSchema);