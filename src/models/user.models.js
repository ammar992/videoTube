import mongoose from 'mongoose';
import bcryjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: [true, 'fullname is required'],
    },
    // avatar: {
    //   type: String,
    //   required: [true, 'avatar is required'],
    // },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    wacthHistroy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcryjs.hashSync(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryjs.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESSTOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIERY,
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIERY,
  });
};
export const User = mongoose.model('User', userSchema);
