// user.controller.js

import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generate tokens ");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("Email:", email);
  //   if (fullName === "") {
  //     throw new ApiError(400,"fullName is required");
  //   }

  // OR
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with Email or username already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;

  // const coverImageLoaclPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0];
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username ? username.toLowerCase() : "", // Check if username is defined before converting it to lowercase
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring a user");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Registerd Successfully"));
});

// login controller

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Finding the user
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Checking password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generating tokens
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user._id);

  // Selecting user without sensitive information
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // Setting options for cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Sending response with cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
 // <-- Issue here, should be .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User Logged in successfully"));
});


const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.use._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res 
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"user Logged Out") )
})

export { registerUser, loginUser ,logoutUser };
