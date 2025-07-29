import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import blankProfile from "../uploads/blank_profile.png";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const ViewProfile = () => {
  const { userId } = useParams();
  const { user } = useUserContext();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [openLikesPostId, setOpenLikesPostId] = useState(null);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get(`/users/profile/${userId}`);
        setUserData(res.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axiosInstance.get(`/posts/user/${userId}`);
        setUserPosts(res.data.posts);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const toggleLikes = (postId) => {
    setOpenLikesPostId(openLikesPostId === postId ? null : postId);
  };

  const toggleComments = (postId) => {
    setOpenCommentsPostId(openCommentsPostId === postId ? null : postId);
  };


  const handleUpdatePost = (postId) => {
    navigate(`/update-post/${postId}`);
  };
  
  const handleUpdateProfile = (userId) => {
  
    navigate(`/update-profile/${userId}`);
  };


  const handleDeletePost = async (postId) => {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        await axiosInstance.delete(`/posts/deletePost/${postId}`);
        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        console.log("Post deleted:", postId);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };


  
  const deleteComment = async (commentId, postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/posts/deleteComment/${commentId}`);
        setUserPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: post.comments.filter((c) => c._id !== commentId),
                }
              : post
          )
        );
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-6">
        <img
          src={userData.coverImage}
          alt="User"
          className="w-24 h-24 rounded-full border-2 border-purple-600 object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold text-purple-800">
            {userData.username}
          </h1>
          <p className="text-gray-900">Total posts: {userPosts.length}</p>
          <div className="mt-2 flex gap-6 text-sm text-gray-700">
            <span
              className="cursor-pointer hover:text-purple-700"
              onClick={() => setShowFollowers((prev) => !prev)}
            >
              Followers: {userData.followers?.length || 0}
            </span>
            <span
              className="cursor-pointer hover:text-purple-700"
              onClick={() => setShowFollowing((prev) => !prev)}
            >
              Following: {userData.following?.length || 0}
            </span>
          </div>

          {user?._id === userData._id && (
            <button
              onClick={() => handleUpdateProfile(userId)}
              className="text-sm px-3 absolute top-10 right-1/4 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded"
            >
              Update
            </button>
          )}

          {showFollowers && (
            <div className="mt-2 text-sm text-gray-700">
              <strong>Followers:</strong>
              <ul className="list-disc ml-5">
                {userData.followers?.map((follower, index) => (
                  <li key={follower?._id || index}>
                    {follower?.username || "Unknown User"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showFollowing && (
            <div className="mt-2 text-sm text-gray-700">
              <strong>Following:</strong>
              <ul className="list-disc ml-5">
                {userData.following?.map((followee, index) => (
                  <li key={followee?._id || index}>
                    {followee?.username || "Unknown User"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <hr className="my-6 border-t-2" />

      <h2 className="text-xl font-semibold text-purple-700 mb-4">
        Posts by {userData.username}
      </h2>

      {userPosts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid gap-6 w-max-4xl mx-auto">
          {userPosts.map((post) => (
            <div
              key={post._id}
              className="relative p-[20px] max-w-4xl border border-black bg-white rounded-lg shadow-lg"
            >
              <div className="p-1 m-2 rounded-full flex gap-4 items-center w-max-4xl mx-auto">
                <img
                  className="h-12 w-12 border-2 border-black rounded-full object-cover"
                  src={post.author?.coverImage || blankProfile}
                  alt="Profile"
                />
                <h2 className="text-xl font-medium">
                  {post.author?.username || "Unknown"}
                </h2>
              </div>
              <div className="absolute top-5 right-2 p-[20px]  bg-white rounded-lg shadow-lg">
                <div className="absolute top-4 right-4 flex gap-2">
                  {(post.author?._id === user?._id ||
                    user?.role === "admin") && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      {post.author?._id === user?._id && (
                        <button
                          onClick={() => handleUpdatePost(post._id)}
                          className="text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded"
                        >
                          Update
                        </button>
                      )}

                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {post.multimedia &&
                (post.multimedia.endsWith(".mp4") ? (
                  <video className="w-full rounded-lg shadow-lg mb-4" controls>
                    <source src={post.multimedia} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    className="w-full rounded-lg shadow-lg mb-4"
                    src={post.multimedia}
                    alt="Post"
                  />
                ))}

              <p className="text-gray-700 mb-6">{post.content}</p>

              <div className="flex flex-wrap gap-4 justify-between mb-6 p-2">
                <button
                  className="flex items-center gap-2 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                  onClick={() => toggleLikes(post._id)}
                >
                  Likes ({post.likes?.length || 0})
                </button>

                <button
                  className="flex items-center gap-2 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                  onClick={() => toggleComments(post._id)}
                >
                  Comments ({post.comments?.length || 0})
                </button>
              </div>

              {openLikesPostId === post._id && (
                <div className="pl-4 text-sm text-purple-700 mb-4">
                  <strong>Liked by:</strong>
                  {post.likes?.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {post.likes.map((user) => (
                        <li key={user._id}>{user.username || "Unknown"}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No likes yet.</p>
                  )}
                </div>
              )}

              {openCommentsPostId === post._id && (
                <div className="comments-section text-sm text-gray-800">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">
                    Comments ({post.comments?.length || 0})
                  </h3>

                  <ul className="space-y-4">
                    {post.comments.map((comment) => (
                      <li
                        key={comment._id}
                        className="bg-gray-200 p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <strong className="text-purple-800">
                              {comment.user?.username || "Unknown"}:
                            </strong>{" "}
                            {comment.text}
                          </div>
                          {(comment.user?._id === user?._id ||
                            post.author?._id === user?._id ||
                            user?.role === "admin") && (
                            <button
                              className="text-red-500 hover:underline"
                              onClick={() =>
                                deleteComment(comment._id, post._id)
                              }
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
