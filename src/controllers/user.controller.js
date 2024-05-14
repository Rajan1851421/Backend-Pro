// user.controller.js

import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // Business logic for registering the user

  // Assuming registration is successful, send a JSON response

  // get user detail from frontend
  // add validation( not empty)
  // check if user already exist:via username or email
  // check for images and check for avatar
  // upload them to cloudinary,check avatar on multer
  //  create user object - create entry in DB
  // remove oassword and refresh token field from the response
  // check for user creation
  // return reponse
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
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 ){
    coverImageLocalPath = req.files.coverImage[0]
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
    username: username ? username.toLowerCase() : "" // Check if username is defined before converting it to lowercase
  });
  
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"

)

if(!createdUser){
    throw new ApiError(500, "Something went wrong while registring a user");
}
return res.status(201).json(
    new ApiResponse(201, createdUser,"User Registerd Successfully")
)



});

export { registerUser };
