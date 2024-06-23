import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

export const jwtVerify = asyncHandler(async (req, res, next) => {
 try {
     const token =
       req.cookies?.accessToken ||
       req.header('Authorization')?.replace('Bearer ', '');
     if (!token) {
       throw new ApiError(401, 'Unauthorized request');
     }
     const decodetoken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
     const user = await User.findById(decodetoken._id);
     if (!user) {
       throw new ApiError(401, 'Invalid token');
     }
     req.user = user;
     next();
 } catch (error) {
    throw new ApiError(400, error.message ||"Invalid token")
 }
});
