const { user } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { isValidObjectId } = require('mongoose');
const { AlreadyExistError, InternalServerError, InvalidError, } = require("../../utils/errorHandling");
const { sendVerifyEmaleTemplate } = require("../../services/emailServices/template");
const { changeMailMetaKey } = require("../../services/emailServices/changeMailMetaKey");

//FOR REGISTER
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, city, email, address, password, Phone, zipCode, role, userName, visit_type, permissions, userId, status, requests, is_Verified } = req.body;
    if (!firstName) {
      return res.status(400).json({ message: "Please enter first name" })
    }

    if (!userName) {
      return res.status(400).json({ message: "Please enter last user name" })
    }

    if (! /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/.test(userName)) {
      return res.status(400).json({ message: "Please enter at least 1 upper 1 lower and 1 digint latter" })
    }

    if (!lastName) {
      return res.status(400).json({ message: "Please enter last name" })
    }

    if (!email) {
      return res.status(400).json({ message: "Please enter email" })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please enter valid email" })
    }

    if (!Phone) {
      return res.status(400).json({ message: "Phone number is required" })
    }

    const isUserExist = await user.findOne({ email: email })
    if (isUserExist) {
      return AlreadyExistError(res, "User")
    }
    const isUsernameExist = await user.findOne({ userName: userName })
    if (isUsernameExist) {
      return AlreadyExistError(res, "User name")
    }
    let hashedPassword;
    if (password) {
      if (!password) {
        return res.status(400).json({ message: "Please enter password" })
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(password)) {
        return res.status(400).json({ message: "Please enter at least 1 lower 1 upper and 1 digint latter." })
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newUser = new user({ firstName, lastName, email, userName, address, Phone, zipCode, requests, password: hashedPassword ? hashedPassword : "", role, city, visit_type, status, permissions, userId, is_Verified });
    await newUser.save();
    // if( role === "Client" ) {
    //   const newRequest = new request({
    //       request_by: newUser?._id,
    //       request_details,
    //       requests,                
    //       request_status: "Submitted",
    //   })
    //   await newRequest.save()
    // }
    // sendVerifyEmale(newUser);
    res.status(201).json({
      status: true,
      message: "User Added",
      data: newUser,
    });
  } catch (error) {
    console.log("err", error);
    return InternalServerError(res, error)
  }
}


//FOR UPDATE USER
const updateUser = async (req, res) => {
  try {
    let file = req.file;
    const userData = { ...req.body };
    const userId = req.userId;
    const id = req.query.id;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ status: false, message: "Please provide a correct ID" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ status: "fail", message: "Unauthorized user" });
    }

    if (!id) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    if (req?.body?.assign_to) {
      await request.updateMany({ request_by: id }, { assign_to: req?.body?.assign_to })
    }

    let updatedUserData = await user
      .findByIdAndUpdate(id, userData, { new: true })
      .populate("assign_to");

    if (updatedUserData && updatedUserData?._id) {
      let flagUpdateImage = false;
      let image = false;
      if (updatedUserData?.profileImage) {
        if (file) {
          deleteFile(updatedUserData?.profileImage);
          flagUpdateImage = true;
          image = file?.transforms[0].key;
        } else if (req?.body?.deleteProfileImage) {
          deleteFile(updatedUserData?.profileImage);
          flagUpdateImage = true;
        }
      } else if (file) {
        flagUpdateImage = true;
        image = file?.transforms[0].key;
      }
      let reflection = { $set: {}, $unset: {} };
      if (flagUpdateImage) {
        if (image) {
          reflection.$set.profileImage = image;
        } else {
          reflection.$unset = {
            profileImage: 1,
          };
        }
      }
      updatedUserData = await user
        .findByIdAndUpdate(id, reflection, { new: true })
        .populate("assign_to");
      delete req?.body?.deleteProfileImage;
    }

    return res
      .status(200)
      .json({ status: true, message: "User updated", data: updatedUserData });
    // });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      status: false,
      message: "Error occurred while updating user",
      error,
    });
  }
};

//FOR DELETE USER
const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.query.id;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ status: false, message: "Please provide a correct ID" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ status: true, message: "Unauthorized user" });
    }
    if (!id) {
      return res.status(404).json({ status: true, message: "User not found" });
    }
    const deletedUser = await user.findByIdAndUpdate(id, { isArchive: true });
    return res
      .status(200)
      .json({ status: true, message: "User deleted", data: deletedUser });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      status: true,
      message: "Error occurred while updating user",
      error,
    });
  }
};

//FOR GET ALL Users
const getUserByTypeList = async (req, res) => {
  try {
    let userLists = [];
    let roles = {};
    if (req?.body?.role !== "") {
      roles = { role: req?.body?.role };
    }
    const totalUsersCount = await user.countDocuments(roles);

    roles.isArchive = false;
    userLists = await user
      .find(roles)
      .sort({ createdAt: -1 })
      .populate("assign_to");

    return res.status(200).json({
      status: true,
      message: "List of all users",
      data: {
        userLists: userLists,
        totaCount: totalUsersCount,

      },
    });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

//FOR  SEARCH USER
const searchUser = async (req, res) => {
  try {
    const searchParameter = req.query.search;
    let searchQuery = {};
    if (searchParameter) {
      searchQuery = {
        $or: [
          { firstName: { $regex: searchParameter, $options: "i" } },
          { lastName: { $regex: searchParameter, $options: "i" } },
          { role: { $regex: searchParameter, $options: "i" } },
        ],
      };
    }
    searchQuery.isArchive = false;
    const userData = await user.find(searchQuery);
    return res
      .status(200)
      .json({ status: true, message: "Users found", data: userData });
  } catch (error) {
    return InternalServerError(res, error);
  }
};

//RESET PASSWORD
const resetPassword = async (req, res) => {
  try {

    const id = req.query.id;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ status: false, message: "Please provide a correct ID" });
    }

    const findUser = await user.findOne({ _id: id });

    if (!findUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    } else if (findUser.password) {
      const isPasswordValid = await bcrypt.compare(req.body.oldPassword, findUser.password);

      if (!isPasswordValid) {
        return InvalidError(res, 'password not match');
      }

      const saltRounds = 10;
      let newPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
      const updatedUser = await user.findByIdAndUpdate(id, { password: newPassword }, {
        new: true,
      });

      return res
        .status(200)
        .json({ status: true, message: "User updated successfully!", data: updatedUser });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//FOR LOGIN 
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;


    if (!email && !userName) {
      return res.json({ message: "Please enter email or userName" });
    }

    if (!password) {
      return res.json({ message: "Please enter password" });
    }

    const isUserExist = await user.findOne({ email: email, role: "Super_Admin" });

    if (!isUserExist) {
      return InvalidError(res, 'email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, isUserExist.password);

    if (!isPasswordValid) {
      return InvalidError(res, 'email or password');
    }

    const token = jwt.sign({ user: isUserExist }, process.env.JWT_SECRETE_KEY);

    return res.status(200).json({ status: true, message: "Login success", data: token });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//FOR UPDATE email
const changeEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.query.id;

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ status: false, message: "Please provide a correct ID" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ status: "fail", message: "Unauthorized user" });
    }
    if (!id) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    // Generate a random string using Math.random() and convert it to base36
    const randomString = Math.random().toString(36).substring(2, 10);

    // Combine the ID, current date, and random string
    const combinedString = `${randomString}${id}`;


    const updatedUserData = await user
      .findByIdAndUpdate(id, { changeMailMetaKey: combinedString, tempEmail: req.body.email }, { new: true })
      .populate("assign_to");


    changeMailMetaKey(updatedUserData)
    return res
      .status(200)
      .json({ status: true, message: "User updated", data: updatedUserData });

  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      status: false,
      message: "Error occurred while updating user",
      error,
    });
  }
};

//FOR VERIFY USER
const verifyChangeEmail = async (req, res) => {
  try {
    const { id } = req.body;
    const userData = await user.findOne({ changeMailMetaKey: id });
    let updateUser = {}
    if (userData) {
      updateUser = await user.findOneAndUpdate({ changeMailMetaKey: id }, { $set: { email: userData.tempEmail, tempEmail: "", changeMailMetaKey: "" } })
      return res.status(200).json({ status: true, message: "Email verified successfully", data: updateUser })
    } else {
      return res.status(200).json({ status: true, message: "Email not verified successfully", data: updateUser })
    }
  } catch (error) {
    return InternalServerError(res, error)
  }
}

//FOR GET USER DETAILS
const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ status: true, message: "User not found" });
    }

    const userData = await user.findById(userId);
    return res
      .status(200)
      .json({ status: true, message: "User found", data: userData });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUserByTypeList,
  searchUser,
  resetPassword,
  loginUser,
  changeEmail,
  verifyChangeEmail,
  getUserDetails
};
