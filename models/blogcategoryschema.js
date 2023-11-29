const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogcategory = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    }
});

//Export the model
module.exports = mongoose.model('blogcatagories', blogcategory);