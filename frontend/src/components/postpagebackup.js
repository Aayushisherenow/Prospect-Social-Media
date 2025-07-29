import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare, faComment } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const AllPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentStatus, setCommentStatus] = useState({});

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axiosInstance.post("/posts/feed");
        setPosts(res.data.data || []);
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    };
    fetchAllPosts();
  }, []);

  const toggleCommentInput = (postId) => {
    setActiveCommentPostId((prevId) => (prevId === postId ? null : postId));
    setCommentText("");
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-pink-500 text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">📰 All Posts</h1>
          <p className="text-sm opacity-90 mt-1">
            See what others are sharing!
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white border border-gray-300 rounded-xl shadow-lg mb-8 p-4"
          >
            {/* Post Header */}
            <div className="flex items-center gap-4 mb-4">
              <img
                className="h-12 w-12 border-2 border-purple-600 rounded-full object-cover"
                src={post.author.coverImage}
                alt="Profile"
              />
              <h2 className="text-xl font-semibold">
                {post.author?.username || "Unknown User"}
              </h2>
            </div>

            {/* Multimedia */}
            {post.multimedia && post.multimedia.endsWith(".mp4") ? (
              <video className="w-full rounded-lg shadow mb-4" controls>
                <source src={post.multimedia} type="video/mp4" />
              </video>
            ) : post.multimedia ? (
              <img
                src={post.multimedia}
                className="w-full rounded-lg shadow mb-4"
                alt="Post Multimedia"
              />
            ) : null}

            {/* Content */}
            <p className="text-gray-800 mb-4">{post.content}</p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-4">
              <button
                className="flex items-center gap-2 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                onClick={() => handleLikeClick(post._id)}
              >
                <FontAwesomeIcon icon={faHeart} />
                {post.isLiked ? "Liked" : "Like"}{" "}
                <span>({post.likesCount})</span>
              </button>
              <button
                onClick={() => toggleCommentInput(post._id)}
                className="flex items-center gap-2 bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
              >
                <FontAwesomeIcon icon={faComment} /> Comment{" "}
                <span>({post.commentsCount})</span>
              </button>
              <button className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                <FontAwesomeIcon icon={faShare} /> Share
              </button>
            </div>

            {/* Comment Input */}
            {activeCommentPostId === post._id && (
              <div className="mt-2 mb-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
                />
                <button
                  onClick={() => handleCommentSubmit(post._id)}
                  className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
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

            {/* View Post Link */}
            <div className="mt-4">
              <Link
                to={`/post/${post._id}`}
                className="inline-block text-purple-600 hover:underline font-semibold"
              >
                → View full post
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default AllPostsPage;
