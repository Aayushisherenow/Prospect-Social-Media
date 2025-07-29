import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      index: true,
      trim: true,
      lowercase: [true, "Username must be in lowercase"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already taken"],
      lowercase: [true, "Email must be in lowercase"],
      trim: true,
      validate: {
        validator: (email) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        },
      },
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    coverImage: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      trim: true,
      select: false,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    interests: {
      type: [String], 
      default: [],
    },
  },
  { timestamps: true }
);


// ===============================schema methods=================================
// ============hash password before saving=====================================
// This middleware function is called before saving a user document to the database. It checks if
//  the password field has been modified, and if so, it hashes the password using bcrypt
//  and then calls the next middleware function. 

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
}
);


// ===============================compare password=================================
// This method compares a plain text password with the hashed password stored in the database.
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// ===============================generate access token and refresh token=================



// This method generates a JSON Web Token (JWT) for the user. The token contains the user's ID and is signed
//  with a secret key.
userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
      
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  });
  return token;
  console.log("Access Token Generated:", token);
};


userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
  return refreshToken;
  console.log("Refresh Token Generated:", refreshToken);
};
 

export const User = mongoose.model("User", userSchema);
