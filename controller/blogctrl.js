require("../config/database");


const blog = require("../models/blogschema");
const user = require("../models/schema");

const createblog = async (req, res) => {
  const data = await new blog(req.body);
  const result = await data.save();
  res.json(result);
};

const updateblog = async (req, res) => {
  const { id } = req.params;

  const updateblog = await blog.findByIdAndUpdate(id, req.body);

  res.send({
    message: "blog Updated Successfully",
    result: updateblog,
  });
};

const deleteblog = async (req, res) => {
  const { id } = req.params;

  const deleteblog = await blog.findByIdAndDelete(id);

  res.send({
    message: "blog Deleted Successfully",
  });
};

const getoneblog = async (req, res) => {
  const { id } = req.params;

  const getoneblog = await blog.findById(id)
  .populate('likes')
  .populate('dislikes');
  const updateviews = await blog.findByIdAndUpdate(
    id,
    {
        $inc: {numViews: 1 },
    },
  )

  res.json(getoneblog);
};

const getallblog = async (req, res) => {
  const getallblog = await blog.find();
  res.json(getallblog);
};


const liketheblog = async (req, res) => {

    const { blogId } = req.body;

    // Find the blog which you want to be liked
    const bloog = await blog.findById(blogId);
    
    // find the login user
    const loginUserId = req?.userData?._id;
    
    // find if the user has liked the blog
    const isliked = await bloog.isliked;

    // find if the user has disliked the blog
    const alreadyDisliked = bloog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
      );


      if (alreadyDisliked) {
        const dislikeblog = await blog.findByIdAndUpdate(
          blogId,
          {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
          },
          { new: true }
        );
        res.json(dislikeblog);
      }

      if (isliked) {
        const likeblog = await blog.findByIdAndUpdate(
          blogId,
          {
            $pull: { likes: loginUserId },
            isliked: false,
          },
          { new: true }
        );
        res.json(likeblog);
      } else {
        const likeblog = await blog.findByIdAndUpdate(
          blogId,
          {
            $push: { likes: loginUserId },
            isliked: true,
          },
          { new: true }
        );
        res.json(likeblog);
      }
  };



  const disliketheblog  = async (req, res) => {

    const { blogId } = req.body;

    // Find the blog which you want to be liked
    const bloog = await blog.findById(blogId);
    
    // find the login user
    const loginUserId = req?.userData?._id;
    
    // find if the user has liked the blog
    const isDisliked = await bloog.isDisliked;

    // find if the user has disliked the blog
    const alreadyliked = bloog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
      );


      if (alreadyliked) {
        const likeblog = await blog.findByIdAndUpdate(
          blogId,
          {
            $pull: { likes: loginUserId },
            isLiked: false,
          },
          { new: true }
        );
        res.json(likeblog);
      }

      if (isDisliked) {
        const dislikeblog = await blog.findByIdAndUpdate(
          blogId,
          {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
          },
          { new: true }
        );
        res.json(dislikeblog);  
      } else {
        const dislikeblog = await blog.findByIdAndUpdate(
          blogId,
          {
            $push: { dislikes: loginUserId },
            isDisliked: true,
          },
          { new: true }
        );
        res.json(dislikeblog);
      }
  };

  
const uploadfile = async (req, res) => {

   const id = req.userdData;

  
  try {
    const imageUrl = req.file.path;
    

    const { blogid } = req.body;

    const existingblog = await blog.findById(blogid);


    if (!existingblog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Add the uploaded image URL to the images array of the existing product
    existingblog.images.push(imageUrl); //push the imgurl in image field in db

    // Save the updated product
    const updatedBlog = await existingblog.save();
    const imageFullPath = `https://example.com/${imageUrl}`;


    res.json({
      updatedProduct: { ...updatedBlog._doc, images: [imageFullPath] },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
  createblog,
  updateblog,
  deleteblog,
  getoneblog,
  getallblog,
  liketheblog,
  disliketheblog,
  uploadfile
};
