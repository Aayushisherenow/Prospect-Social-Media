import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: { type: String },
    multimedia: { type: String },
    tags: [{ type: String }],
    location: { type: String },
    likesCount: { type: Number, default: 0 },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reportsCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    sentiment: {
      type: String,
      enum: ["Positive", "Negative", "Neutral"],
      default: "Neutral",
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
