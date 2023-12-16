require("../config/database");

const con = require("../models/schema");
const Cart = require("../models/cartschema");
const Product = require("../models/productschema");
const Coupon = require("../models/couponschema");
const uniqid = require('uniqid'); 
const order = require('../models/orderschema')


const generateToken = require("../auth/generateToken");
const refreshtoken = require("../auth/refreshtoken");
const validatemongodbid = require("../util/validatemongodbid");
const jwt = require("jsonwebtoken"); // Import the 'jsonwebtoken' library

const mongoose = require("mongoose");
const crypto = require("crypto");

const bcrypt = require("bcrypt");
const sendemail = require("./emailctrl");

const createuser = async (req, res, err) => {
  const user = await new con({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
    role: req.body.role,
  });

  if (user) {
    try {
      await user.save();
      res.status(201).json({ message: "User saved successfully", user });
    } catch (err) {
      res.status(500).json({ error: "Email already Exist" });
    }
  } else {
    res
      .status(400)
      .json({ error: "Bad Request", details: "User data is empty" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ success: 0, message: "Invalid email or password" });
  }

  const finduser = await con.findOne({ email });
  if (!finduser) {
    res.status(400).json({ message: "Invalid email" });
  }

  try {
    const hashpassword = finduser.password;

    bcrypt.compare(password, hashpassword, (err, isMatch) => {
      if (err) {
        res.status(400).json({ message: "Sorry, something went wrong" });
      } else if (isMatch) {
        const jsontoken = generateToken({ _id: finduser._id });
        const generaterefreshtoken = refreshtoken({ _id: finduser._id });

        // // Set the refresh token in the user document and save it
        // const userupdate =  con.findByIdAndUpdate(finduser._id,{
        //   generaterefreshtoken: generaterefreshtoken
        // })

        res.cookie("refreshtoken", generaterefreshtoken, {
          httpOnly: true,
          maxAge: 72 * 60 * 60 * 1000,
        });

        res.status(200).json({
          message: "User logged in",
          finduser,
          token: jsontoken,
        });
      } else {
        res.json({ message: "Password does not match" });
      }
    });
  } catch {
    res.status(400).json({ message: "Something went wrong" });
  }
};

const handlerefreshtoken = async (req, res) => {
  try {
    const cookie = await req.cookies;

    if (!cookie.refreshtoken) {
      return res.json({ message: "No Refresh Token in Cookies" });
    }

    const refreshtoken = cookie.refreshtoken;
    const secretKey = "abc1234"; // Use the same secret key you used to generate the token

    try {
      // Verify and decode the refresh token
      const decodedToken = jwt.verify(refreshtoken, secretKey);

      // The payload of the decoded token contains user information
      const userId = decodedToken._id; // Adjust this to match the structure of your token

      // Use the user information (e.g., userId) to retrieve the user from the database
      const user = await con.findById(userId);

      if (!user) {
        return res.json({ message: "User not found for this Refresh Token" });
      }

      const accesstoken = generateToken({ _id: user._id });
      res.json({ accesstoken });

      // res.json(user);
    } catch (error) {
      console.error("Error while decoding the refresh token:", error);
      res.status(401).json({ message: "Invalid Refresh Token" });
    }
  } catch (error) {
    console.error("Error while handling refresh token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const cookie = await req.cookies;

    if (!cookie.refreshtoken) {
      return res.json({ message: "No Refresh Token in Cookies" });
    }
    const refreshtoken = cookie.refreshtoken;

    // Instead of trying to modify the user's refresh token, simply clear the cookie
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: true,
    });

    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error("Error while handling refresh token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const logout = async (req, res) => {
//   try {
//     const cookie = await req.cookies;

//     if (!cookie.refreshtoken) {
//       return res.json({ message: 'No Refresh Token in Cookies' });
//     }
//     const refreshtoken = cookie.refreshtoken;

//     const decodedToken = jwt.verify(refreshtoken, 'abc1234');

//     const userId = decodedToken._id;

//     const user = await con.findById(userId);

//     if (!user) {
//       res.clearCookie("refreshtoken", {
//         httpOnly: true,
//         secure: true,
//       });
//       return res.status(204); // 204 No Content
//     }

//     user.refreshtoken = "";
//     console.log('Refresh token cleared:', user.refreshtoken);
//     await user.save();

//     // Clear the cookie and return a response
//     res.clearCookie("refreshtoken", {
//       httpOnly: true,
//       secure: true,
//     });

//     res.status(204).send(); // 204 No Content
//   } catch (error) {
//     console.error('Error while handling refresh token:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

const getalluser = async (req, res) => {
  const getalluserdata = await con.find();
  res.json(getalluserdata);
};

const getoneuser = async (req, res) => {
  const { id } = req.params;
  validatemongodbid(id);

  const getoneuserdata = await con.findById(id);
  res.json(getoneuserdata);
};

const deletuser = async (req, res) => {
  const { id } = req.params;
  validatemongodbid(id);

  const removeuser = await con.findByIdAndRemove(id);
  res.json("user deleted successfully", removeuser);
};

const updateuser = async (req, res) => {
  const id = await req.params.id;
  validatemongodbid(id);

  try {
    const data1 = await con.findByIdAndUpdate(id, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
      role: req.body.role,
    });

    res.json({ message: "user updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const blockuser = async (req, res) => {
  const id = req.params.id; // Access the id property
  validatemongodbid(id);

  try {
    const block = await con.findByIdAndUpdate(id, {
      isBlocked: true,
    });

    res.json({
      message: "user Blocked",
    });
  } catch (err) {
    res.json(err);
  }
};

const unblockuser = async (req, res) => {
  const id = req.params.id; // Access the id property
  validatemongodbid(id);

  try {
    const unblock = await con.findByIdAndUpdate(id, {
      isBlocked: false,
    });

    res.json({
      message: "user UnBlocked",
    });
  } catch (err) {
    res.json(err);
  }
};

// const updatepassword = async (req, res) => {
//   const { _id } = req.userData;
//   const newPassword = req.body.newPassword; // Assuming you have a field called "newPassword" in the request body
//   console.log(newPassword);
//   const user = await con.findById(_id);

//   if (newPassword) {
//     // Retrieve the user's existing hashed password from the database
//     const existingHashedPassword = user.password;
//     console.log(existingHashedPassword);

//     // Hash the new password for comparison
//     const isMatch = await bcrypt.compare(newPassword, existingHashedPassword);
//     console.log(isMatch);
//     return false;

//     if (isMatch) {
//       // The new password matches the existing password
//       res.json({
//         message: "Password remains the same",
//       });
//     } else {
//       // Hash the new password for storage in the database
//       const hashedPassword = await bcrypt.hash(newPassword, 10); // Use an appropriate number of salt rounds

//       // Update the user's password with the new hashed password
//       user.password = hashedPassword;

//       try {
//         // Save the updated user
//         const updatedUser = await user.save();
//         res.json({
//           message: "Password updated successfully",
//           updatedUser,
//         });
//       } catch (error) {
//         res.status(500).json({
//           error: "User save failed",
//         });
//       }
//     }
//   } else {
//     res.json({
//       message: "No new password provided",
//     });
//   }
// };

const updatepassword = async (req, res) => {
  const { _id } = req.userData;
  const { password } = req.body;
  const user = await con.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
};

const forgotpasswordtoken = async (req, res) => {
  const email = req.body.email; // Ensure you are retrieving the email correctly

  if (!email) {
    return res.status(500).json("Email is required");
  }

  const user = await con.findOne({ email });

  if (!user) {
    return res.status(500).json("Invalid email");
  }

  try {
    let token = await user.createPasswordResetToken();
    console.log(token);

    await user.save();
    const resetUrl = `hey follow this link for reset password <a href="http://localhost:2000/reset-password/${token}">Click Here</a>`;
    const data = {
      to: email, // Use the email variable from the request
      text: "hey user",
      subject: "forgot password link",
      htm: resetUrl,
    };
    console.log(data);
    sendemail(data);
    res.json(token);
  } catch (err) {
    res.json(err);
  }
};

const resetpassword = async (req, res) => {
  const password = req.body.password;
  const token = req.params.token;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  0;
  const user = await con.findOne({
    passwordResetToken: hashedToken,
    // passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) res.json("Token Expired, Please try again later");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
};

const saveaddress = async (req, res) => {
  const id = req.userData;
  const address = req.body.address;

  try {
    const finduser = await con.findByIdAndUpdate(id, {
      address: address,
    });

    res.json(finduser);
  } catch {
    res.json({
      message: "some error occured",
    });
  }
};

const getwishlist = async (req, res) => {
  const id = req.userData;

  try {
    const data = await con.findById(id).populate("wishlist");
    res.json(data);
  } catch {
    res.json({
      message: "could not find",
    });
  }
};

const usercart = async (req, res) => {
  try {
    const id = req.userData;

    const { cart } = req.body;

    let products = [];

    const user = await con.findById(id);

    const alreadyExistCart = await Cart.findOne({ orderby: user._id });

    if (alreadyExistCart) {
      await Cart.deleteOne({ orderby: user._id });
    }

    for (let i = 0; i < cart.length; i++) {
      let object = {};

      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }

    let carttotal = 0;
    for (let i = 0; i < products.length; i++) {
      carttotal += products[i].count * products[i].price;
    }

    const newcart = await new Cart({
      products,
      carttotal,
      orderby: user._id,
    }).save();

    res.json(newcart);
  } catch {
    res.json({
      message: "some error occured",
    });
  }
};

const getusercart = async (req, res) => {
  const id = req.userData;
  try {
    const usercart = await Cart.findOne({ orderby: id }).populate(
      "products.product"
    );
    res.json(usercart);
  } catch {
    res.json({
      message: "some error occured",
    });
  }
};

const emptycart = async (req, res) => {
  const id = req.userData;
  try {
    const usercart = await Cart.findOneAndRemove({ orderby: id });
    res.json(usercart);
  } catch {
    res.json({
      message: "some error occured",
    });
  }
};

const applycoupon = async (req, res) => {
  const { coupon } = req.body;
  const id = req.userData;

  const validcoupon = await Coupon.findOne({ name: coupon });

  if (validcoupon === null) {
    res.json("invalid Coupon");
  }

  const user = await con.findById(id);

  const { carttotal } = await Cart.findOne({ orderby: user._id });

  let totalafterdiscount = (
    parseFloat(carttotal) -
    (parseFloat(carttotal) * parseFloat(validcoupon.discount)) / 100
  ).toFixed(2);

  await Cart.findOneAndUpdate({
    orderby: user._id,
    totalAfterDiscount: totalafterdiscount,
  });

  res.json(totalafterdiscount);
};


const createorder = async (req,res)=>{

  const id = req.userData;
  const {COD,couponApplied} = req.body
  try{

  if(!COD){
    res.json("Create cash order failed")
  }


  const user = await con.findById(id);
 

  const usercart = await Cart.findOne({ orderby: user._id });
  

  
  let finalamount = 0;
  if(couponApplied && usercart.totalAfterDiscount)
  {
    finalamount = usercart.totalAfterDiscount
  }
  else{
    finalamount = usercart.carttotal; 
  }

  const neworder = await new order({
    products:  usercart.products,
    paymentIntent: {
      id: uniqid(),
      method: "COD",
      amount: finalamount,
      status: "Cash on Delivery",
      created: Date.now(),
      currency: "usd",
    },
    orderby: user._id,
    orderStatus: "Cash on Delivery",
  }).save();
  

  let update = usercart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(update, {});

  res.json({ message: "success" });
}catch
{
  res.json("Some error occured")
}
}


const getorder = async (req,res)=>{

    const id = req.userData;

    try{

       const user = await con.findById(id)     
       const getorder = await order.findOne({ orderby: user._id })
       res.json(getorder);
 
    }catch{
      res.json({
        message: "something went wrong"
      })
    }
}


const getallorders = async(req,res)=>{

  try{

    const getallorder = await order.find();
    res.json(getallorder);
  }catch{
  res.json({
    message: "something went wrong to get all order data"
  })
}
}


const updateorder = async(req,res)=>{

  const {status} = req.body
  const id = req.params.id;

  try{

    
    const updateorder = await order.findByIdAndUpdate(id,{
            
      orderStatus: status,
      paymentIntent: {
        status: status
      }
    }) 
    res.json(updateorder);

  }catch{   
     res.json({
      message: "something went wrong"
     })
  }

}



module.exports = {
  createuser,
  login,
  getalluser,
  getoneuser,
  deletuser,
  updateuser,
  blockuser,
  unblockuser,
  handlerefreshtoken,
  logout,
  updatepassword,
  forgotpasswordtoken,
  resetpassword,
  getwishlist,
  saveaddress,
  usercart,
  getusercart,
  emptycart,
  applycoupon,
  createorder,
  getorder,
  getallorders,
  updateorder,

};
