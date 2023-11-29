require("../config/database");
const con = require("../models/schema");
const generateToken = require("../auth/generateToken");
const refreshtoken = require("../auth/refreshtoken");
const validatemongodbid = require("../util/validatemongodbid");
const jwt = require("jsonwebtoken"); // Import the 'jsonwebtoken' library

const mongoose = require("mongoose");
const crypto = require('crypto')

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
    return res.status(500).json('Email is required');
  }

  const user = await con.findOne({ email });

  if (!user) {
    return res.status(500).json('Invalid email');
  }

  try {
    let token = await user.createPasswordResetToken();
    console.log(token);

    await user.save();
    const resetUrl = `hey follow this link for reset password <a href="http://localhost:2000/reset-password/${token}">Click Here</a>`;
    const data = {
      to: email, // Use the email variable from the request
      text: 'hey user',
      subject: 'forgot password link',
      htm: resetUrl,
    };
    console.log(data);
    sendemail(data);
    res.json(token);
  } catch (err) {
    res.json(err);
  }
}

const resetpassword = async(req,res)=>{


const password = req.body.password;
const token = req.params.token;

const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
0
const user = await con.findOne({
  passwordResetToken: hashedToken,
  // passwordResetExpires: { $gt: Date.now() },
})


if (!user) res.json("Token Expired, Please try again later");

user.password = password;
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
await user.save();
res.json(user);
 
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
  resetpassword
};
