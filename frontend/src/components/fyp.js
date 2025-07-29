import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShare,
  faComment,
  faTrash,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";

const FypPosts = () => {
  const { user } = useUserContext();
  const [posts, setPosts] = useState([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentStatus, setCommentStatus] = useState({});
  const [actionMenuPostId, setActionMenuPostId] = useState(null);

  useEffect(() => {
    const fetchFypPosts = async () => {
      try {
        const res = await axiosInstance.get("/posts/fyp");
          setPosts(res.data.data || []);
          console.log(res.data.data);
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    };
    fetchFypPosts();
  }, [][user]);

  const toggleCommentInput = (postId) => {
    setActiveCommentPostId((prevId) => (prevId === postId ? null : postId));
    setCommentText("");
  };

  const toggleActionMenu = (postId) => {
    setActionMenuPostId((prev) => (prev === postId ? null : postId));
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;

    try {
      await axiosInstance.post(`/posts/comment/${postId}`, {
        text: commentText,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, commentsCount: post.commentsCount + 1 }
            : post
        )
      );

      setCommentStatus((prev) => ({
        ...prev,
        [postId]: "✅ Comment submitted!",
      }));

      setCommentText("");

      setTimeout(() => {
        setCommentStatus((prev) => ({
          ...prev,
          [postId]: "",
        }));
        setActiveCommentPostId(null);
      }, 3000);
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/posts/deletePost/${postId}`);
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  const handleLikeClick = async (postId) => {
    try {
      const res = await axiosInstance.put(`/posts/like/${postId}`);
      const updatedPost = res.data.data.post;
      const isLiked = res.data.data.isLiked;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likesCount: updatedPost.likesCount, isLiked }
            : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleReport = async (postId) => {
    try {
      const res = await axiosInstance.put(`/posts/report/${postId}`);
      const updatedPost = res.data.data.post;
      const isReported = res.data.data.isReported;

      console.log(updatedPost);
      
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isReported,
                reportsCount: updatedPost.reportsCount,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error reporting post:", err);
    }
  };
  

  return (
    <div className="relative mx-auto p-[20px] max-w-4xl border border-black bg-white rounded-lg shadow-lg">
      <div className="container mx-auto">
        {posts.map((post) => (
          <div
            key={post._id}
            className="post-item mb-8 border-b-4 pb-6 relative"
          >
            {/* Top section with author and 3-dots */}
            <div className="flex justify-between items-center px-2">
              <div className="flex gap-4 py-2 items-center">
                <img
                  className="h-12 w-12 border-2 border-black rounded-full object-cover"
                  src={post.author.coverImage}
                  alt="Profile"
                />
                <h2 className="text-xl font-medium">
                  {post.author?.username || "Unknown User"}
                </h2>
              </div>

              {/* 3 Dots icon */}
              <div
                className="relative group p-4 rounded"
                onMouseEnter={() => toggleActionMenu(post._id)}
              >
                {/* Post content goes here */}

                <button className="absolute top-2 right-2 group">
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="text-gray-600 opacity-100 cursor-pointer"
                  />
                </button>
              </div>

              {/* Dropdown Menu */}
              {actionMenuPostId === post._id && (
                <div className="absolute right-2 top-14 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-hidden">
                  {(post.author._id === user._id || user.role === "admin") && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                    >
                      🗑️ Delete
                    </button>
                  )}

                  {user.role === "admin" ? (
                    <div className="w-full text-left px-4 py-2 text-yellow-600 font-medium bg-yellow-50">
                      🚩 Reported ({post.reportsCount || 0})
                    </div>
                  ) : post.isReported ? (
                    <div className="w-full text-left px-4 py-2 rounded-sm bg-yellow-100 text-yellow-700 font-semibold">
                      ✅ Reported
                    </div>
                  ) : (
                    <button
                      onClick={() => handleReport(post._id)}
                      className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-red-900 hover:text-gray-100 font-semibold transition"
                    >
                      🚩 Report
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Media */}
            {post.multimedia && post.multimedia.endsWith(".mp4") ? (
              <video className="w-full rounded-lg shadow-lg mb-4" controls>
                <source src={post.multimedia} type="video/mp4" />
              </video>
            ) : post.multimedia ? (
              <img
                src={post.multimedia}
                className="w-full rounded-lg shadow-lg mb-4"
                alt="Post Multimedia"
              />
            ) : null}

            {/* Content */}
            <p className="text-gray-700 mb-6">{post.content}</p>

            {/* Buttons */}
            <div className="flex mb-6 p-2 gap-6 flex-wrap">
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                onClick={() => handleLikeClick(post._id)}
              >
                <FontAwesomeIcon icon={faHeart} />
                {post.isLiked ? "Liked" : "Like"} ({post.likesCount})
              </button>

              <button
                onClick={() => toggleCommentInput(post._id)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white py-2 px-4 rounded-lg hover:bg-purple-700"
              >
                <FontAwesomeIcon icon={faComment} /> Comment (
                {post.commentsCount})
              </button>

              {/* <button className="flex items-center gap-2 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                <FontAwesomeIcon icon={faShare} /> Share
              </button> */}
            </div>

            {/* Comment box */}
            {activeCommentPostId === post._id && (
              <div className="mt-2 mb-4 px-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
                />
                <button
                  onClick={() => handleCommentSubmit(post._id)}
                  className="px-4 py-2 bg-[#7b2cbf] text-white rounded hover:bg-purple-800"
                >
                  Submit
                </button>
                {commentStatus[post._id] && (
                  <p className="text-green-600 text-sm mt-2">
                    {commentStatus[post._id]}
                  </p>
                )}
              </div>
            )}

            {/* View full post */}
            <div className="border-2 border-[#7b2cbf] flex justify-center items-center bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white rounded-xl px-6 py-3 mt-4 transition duration-300 hover:scale-105 hover:shadow-lg">
              <Link
                to={`/post/${post._id}`}
                className="text-lg font-semibold tracking-wide hover:underline hover:text-black"
              >
                View full post →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FypPosts;
