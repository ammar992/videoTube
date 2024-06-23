import { asyncHandler } from '../utils/asyncHandler.js';
import { APiResponse } from '../utils/ApiResponse.js';
import { UploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';

const userRegister = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;
  if ([username, email, fullName, password].some((data) => data === '')) {
    throw new ApiError(401, 'Empty fields is not allowed');
    return;
  }
  console.log(req.body);
  const checkUser = await User.findOne({ $or: [{ username }, { email }] });
  if (checkUser) {
    throw new ApiError(409, 'User already exist');
    return;
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;

  let avatarLocalPath;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  const uploadAvatar = await UploadOnCloudinary(avatarLocalPath);
  const uploadCoverImage = await UploadOnCloudinary(coverImageLocalPath);
  if (!uploadAvatar) {
    throw new ApiError(401, 'avatar file is required');
  }

  const createUser = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    avatar: uploadAvatar,
    fullName,
    coverImage: uploadCoverImage,
  });

  const findUser = await User.findById(createUser._id).select('-password');
  if (!findUser) {
    throw new ApiError(500, 'Something went wrong');
  }

  return res
    .status(201)
    .json(new APiResponse(200, 'User registered successfully', findUser));
});

// const generateAccessAndRefreshToken = async (id) => {
//   try {
//     const user = await User.findById(id);
//     const refreshToken = user.generateRefreshToken();
//     const accessToken = user.generateAccessToken();
//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });
//     return { refreshToken, accessToken };
//   } catch (error) {
//     throw new ApiError(500, 'Something went wrong');
//   }
// };

// const userLogin = asyncHandler(async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     throw new ApiError(401, 'Empty fields is not allowed');
//   }
//   const user = await User.findOne({
//     $or: [
//       {
//         username,
//       },
//       {
//         email,
//       },
//     ],
//   });

//   if (!user) {
//     throw new ApiError(409, 'User does not exits');
//   }

//   const isPasswordCorrect = await user.isPasswordCorrect();
//   if (!isPasswordCorrect) {
//     throw new ApiError(400, 'Credentials is incorrect');
//   }
//   const { refreshToken, accessToken } = generateAccessAndRefreshToken(user._id);
//   const option = {
//     httpOnly: true,
//     secure: true,
//   };

//   const upadatedUser = await User.findById(user.id).select(
//     '-password -refreshToken'
//   );
//   return res
//     .status(200)
//     .cookie('accessToken', accessToken, option)
//     .cookie('refreshToken', refreshToken, option)
//     .json(
//       new APiResponse(200, 'User logged in successfully', {
//         upadatedUser,
//       })
//     );
// });

// /////// logout

// const userLogout = asyncHandler(async (req, res, next) => {
//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         refreshToken: undefined,
//       },
//     },
//     {
//       new: true,
//     }
//   );
//   const option = {
//     httpOnly:true,
//     secure:true
//   }
//   res.status(200)
//   .clearCookie("accessToken",)
//   .clearCookie("refreshToken")
//   .json(new APiResponse(200,"User logged out successfully",{}));
// });

export { userRegister };
