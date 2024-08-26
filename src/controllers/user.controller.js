import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
    //1. check user details
    const {fullname, email,username,password} = req.body
    if([fullname,email,password,username].some((fields) => fields?.trim() === "")) throw new ApiError(400,"All fields are required.")

    const existingUser =await User.findOne({ $or: [{email},{username}]})
    if(existingUser) throw new ApiError(409,"Username or Email are already exist.")
    
    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log("avatarLocalPath, ", avatarLocalPath)
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath) throw new ApiError(400, "Avatar field is required.")
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log("avatar",avatar)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) throw new ApiError(400, "Avatar is uploading please wait.")
    
        const user = await User.create({
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            username: username.toLowerCase(),
            email,
            password,
            fullname
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        if(!createdUser) throw new ApiError(500, "Something went wrong while registering user.")

        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered sucessfully.")
        )
})

export {registerUser}