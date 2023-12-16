const mongoose = require('mongoose')


const blogschema = mongoose.Schema({



    title:{
      type:String,
      required:true
    },
    description:{
      type:String,
      required:truex
    },
    category:{
      type:String,
      required:true
    },
    numViews:{
      type:Number,
      default:0
    },
    isliked:{
      type:Boolean,
      default:false
    },
    isDisliked:{
      type:Boolean,
      default:false
    },
    images :[
      {
            type: String,
          //   url: String,
      },
  ],
    likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    dislikes: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
       },
      ],

      author: {
        type: String,
        default: "Admin",
      },
},

{  timestamps: true }



)


module.exports = mongoose.model('blog',blogschema)
