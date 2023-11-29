const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var BrandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    
    }
},
{
    timestamps: true
}

);

//Export the model
module.exports = mongoose.model('brands', BrandSchema);