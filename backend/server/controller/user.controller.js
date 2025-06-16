import errorHandler from "../middleware/error-logs/errorHandler.js";
import cloudinary from "../utils/cloudinary.js";

import userModel from "../model/user.model.js";
import bcrypt from 'bcrypt';
import validator from 'validator';
import { generateToken } from "../utils/generateToken.js";

//! register controller
export const registerUser = async (req, res) => {
  const { fullname, email, password, gender } = req.body;

  if (!fullname || !email || !password || !gender) {
    return errorHandler(res, 400, "All fields required");
  }
  if (password.length < 6) {
    return errorHandler(res, 400, "Password length must be at least 6 characters");
  }
  if (!validator.isEmail(email)) {
    return errorHandler(res, 400, "Please enter a valid email");
  }

  try {
    const isExistUser = await userModel.findOne({ email: email });
    if (isExistUser) {
      return errorHandler(res, 400, "User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const boyProfilePic = "https://avatar.iran.liara.run/public/boy";
    const girlProfilePic = "https://avatar.iran.liara.run/public/girl";

    const user = new userModel({
      fullName: fullname,
      email: email,
      password: hashPassword,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (user) {
      generateToken(user._id, res);
      await user.save();
      return errorHandler(res, 201, "User created successfully", user);
    } else {
      return errorHandler(res, 400, "User creation failed, try again");
    }
  } catch (err) {
    return errorHandler(res, 500, `Server error: ${err.message}`);
  }
};

//! login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorHandler(res, 400, "All fields required");
  }

  try {
    const checkUser = await userModel.findOne({ email: email });
    if (!checkUser) {
      return errorHandler(res, 400, "User not found");
    }

    const checkpass = await bcrypt.compare(password, checkUser.password);
    if (checkpass) {
      generateToken(checkUser._id, res);
      return errorHandler(res, 200, "User login success", checkUser);
    } else {
      return errorHandler(res, 400, "Incorrect password");
    }
  } catch (err) {
    return errorHandler(res, 500, `Server error: ${err.message}`);
  }
};

//! logout controller
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    return errorHandler(res, 200, "Logout success");
  } catch (err) {
    return errorHandler(res, 500, `Server error: ${err.message}`);
  }
};

//! updateProfile controller with Cloudinary upload
export const updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return errorHandler(res, 404, "User not found");
    }

    const { fullName, profilePic } = req.body;

    // Upload new profile picture if provided
    if (profilePic) {
      const uploaded = await cloudinary.uploader.upload(profilePic, {
        folder: "chat-profile",
      });
      user.profilePic = uploaded.secure_url;
    }

    if (fullName) {
      user.fullName = fullName;
    }

    const updatedUser = await user.save();
    return errorHandler(res, 200, "Profile updated successfully", updatedUser);
  } catch (err) {
    return errorHandler(res, 500, `Server error: ${err.message}`);
  }
};

//! get user
export const getUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return errorHandler(res, 400, "User not found");
    }
    return errorHandler(res, 200, "Get user success", user);
  } catch (err) {
    return errorHandler(res, 500, `Server error: ${err.message}`);
  }
};
