import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

// ======================= Create a Post =========================
const createPost = asyncHandler(async (req, res) => {
  const { content, tags, location } = req.body;
  const multimedia = req.file;


  if (!content && !multimedia) {
    throw new apiErrors(
      "Post must have at least content, image, or video",
      401
    );
  }

  if (multimedia) {
    const fileType = multimedia.mimetype;
    if (!fileType.startsWith("image/") && !fileType.startsWith("video/")) {
      throw new apiErrors(
        400,
        "Invalid file type. Only images and videos are allowed."
      );
    }
  }

  const filePath = req.file ? `/uploads/${req.file.originalname}` : null;

  const postData = {
    author: req.user._id,
    content,
    tags,
    location,
  };

  if (filePath) {
    postData.multimedia = filePath;
  }

  // Create post in DB
  const post = await Post.create(postData);

  res.status(201).json({
    status: 201,
    data: post,
    message: "Post created successfully",
  });
});

// ======================= Get All Posts =========================
const getAllPosts = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const posts = await Post.find()
    .populate("author", "username coverImage")
    .populate({
      path: "comments",
      populate: { path: "user", select: "username coverImage" },
    })
    .sort({ createdAt: -1 }); // newest posts first

  // Convert posts to plain objects and add isLiked
  const postsWithLikeStatus = posts.map((post) => {
    const isLiked = post.likes.includes(currentUserId);
    return {
      ...post.toObject(),
      isLiked,
      isReported: post.reports?.includes(currentUserId) || false,
    };
  });

  // Separate top 5 posts
  const top5 = postsWithLikeStatus.slice(0, 5);
  const rest = postsWithLikeStatus.slice(5);

  // Shuffle only top 5
  const shuffledTop5 = top5
    .map((p) => ({ sort: Math.random(), value: p }))
    .sort((a, b) => a.sort - b.sort)
    .map((p) => p.value);

  // Combine shuffled top 5 with the rest
  const finalPosts = [...shuffledTop5, ...rest];

  res.status(200).json({
    status: 200,
    data: finalPosts,
    message: "Posts retrieved successfully with top 5 shuffled",
  });
});

// ======================= Like / Unlike Post =========================
const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new apiErrors("Post not found", 404);

  const userId = req.user._id;
  const hasLiked = post.likes.includes(userId);

  if (hasLiked) {
    post.likes.pull(userId);
    post.likesCount -= 1;
  } else {
    post.likes.push(userId);
    post.likesCount += 1;
  }

  await post.save();
  const updatedPost = post.toObject();

  res.status(200).json({
    status: 200,
    data: {
      post: updatedPost,
      isLiked: !hasLiked,
    },
    message: hasLiked ? "Post unliked" : "Post liked",
  });
});

// ======================= Get Post by ID =========================
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username coverImage")
    .populate({
      path: "comments",
      populate: { path: "user", select: "username coverImage" },
    });

  if (!post) throw new apiErrors(404, "Post not found");

  res.status(200).json({
    status: 200,
    data: post,
    message: "Post retrieved successfully",
  });
});

// ======================= Add Comment =========================
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    throw new apiErrors(400, "Comment text is required");
  }

  const post = await Post.findById(req.params.id);
  if (!post) throw new apiErrors(404, "Post not found");

  const comment = await Comment.create({
    user: req.user._id,
    post: post._id,
    text,
  });

  post.comments.push(comment._id);
  post.commentsCount += 1;
  await post.save();

  res.status(201).json({
    status: 201,
    data: comment,
    message: "Comment added",
  });
});

// ======================= Delete Post =========================
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new apiErrors(404, "Post not found");

  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new apiErrors(403, "You can only delete your own post");
  }
  
  await Comment.deleteMany({ _id: { $in: post.comments } }); // Optional: Delete all related comments
  await post.deleteOne();

  res.status(200).json({
    status: 200,
    message: "Post deleted",
  });
});

// ======================= Delete Comment =========================
const deleteComment = asyncHandler(async (req, res, next) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new apiErrors("Comment not found", 404);
    }

    // Fetch the associated post to verify post author
    const post = await Post.findById(comment.post);
    if (!post) {
      throw new apiErrors("Associated post not found", 404);
    }

    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isPostAuthor = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      throw new apiErrors("You are not allowed to delete this comment", 403);
    }

    // Delete the comment
    await comment.deleteOne();

    // Remove comment reference from the post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
      $inc: { commentsCount: -1 },
    });

    return res.status(200).json({
      status: 200,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// ======================= Update Post =========================
const updatePost = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const newMultimedia = req.file; // New multimedia file if provided
   
    const post = await Post.findById(id);
    if (!post) {
      throw new apiErrors("Post not found", 404);
    }

    // 2. Optional: Only allow post author or admin to update
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      throw new apiErrors("You are not allowed to update this post", 403);
    }

    if (content !== undefined) post.content = content;
    if (newMultimedia)
      post.multimedia = `/uploads/${newMultimedia.originalname}`;

    await post.save();

    
    return res.status(200).json({
      status: 200,
      data: post,
      message: "Post updated successfully",
    });
  } catch (error) {
    next(error);
  }
});
//=========================== Get Posts by User =========================
const getPostsByUser = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({ author: userId })
      .populate("author", "username coverImage") 
      .populate({
        path: "comments",
        populate: { path: "user", select: "username" }, 
      })
      .populate("likes", "username") 
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      status: 200,
      message: "User's posts fetched successfully",
      posts,
    });
  } catch (err) {
    next(err);
  }
});


//=========================report post=========================
const reportPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new apiErrors(404, "Post not found");
  }

  if (!post.reports) {
    post.reports = [];
  }

  const hasReported = post.reports.includes(userId.toString());

  if (!hasReported) {
    post.reports.push(userId);
    post.reportsCount += 1;
    await post.save();
  }

  const updatedPost = post.toObject();

  res.status(200).json({
    status: 200,
    message: hasReported ? "Already reported" : "Post reported successfully",
    data: {
      post: updatedPost,
      isReported: true,
    },
  });
});


// ======================= Get For You Posts =========================
const getfypPosts = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  // Fetch user with followings and interests
  const currentUser = await User.findById(currentUserId)
    .select("following interests")
    .populate("following", "username coverImage");

  const interestTags = currentUser.interests || [];
  const followingIds = currentUser.following.map((user) => user._id.toString());

  // Fetch all posts with full population
  const posts = await Post.find()
    .populate("author", "username coverImage")
    .populate({
      path: "comments",
      populate: { path: "user", select: "username coverImage" },
    })
    .populate("likes", "username")
    .sort({ createdAt: -1 });

  // Filter posts: either from followed users OR matching interests
  const filteredPosts = posts.filter((post) => {
    const isFromFollowing = followingIds.includes(post.author._id.toString());
    const postTags = post.tags || [];
    const matchesInterest = postTags.some((tag) =>
      interestTags.includes(tag.toLowerCase())
    );
    return isFromFollowing || matchesInterest;
  });

  // Add isLiked and isReported flags
  const postsWithStatus = filteredPosts.map((post) => {
    const isLiked = post.likes.some(
      (user) => user._id.toString() === currentUserId.toString()
    );
    const isReported = post.reports?.includes(currentUserId) || false;

    return {
      ...post.toObject(),
      isLiked,
      isReported,
    };
  });

  res.status(200).json({
    status: 200,
    message: "For you posts fetched successfully",
    data: postsWithStatus,
  });
});



export {
  createPost,
  deletePost,
  addComment,
  getAllPosts,
  toggleLike,
  deleteComment,
  updatePost,
  getPostById,
  getPostsByUser,
  getfypPosts,
  reportPost
};
