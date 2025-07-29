import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShare,
  faComment,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../utils/axios";
import blankProfile from "../../uploads/blank_profile.png";
import { toast } from "react-toastify";


const PostPage = () => {
  const { postId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user")); 
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await axiosInstance.get(`/posts/post/${postId}`);
        setPost(res.data.data);
      } catch (err) {
        console.error("Error loading post:", err);
      }
    };
    fetchPostData();
  }, [postId]);

  const handleLikeClick = async () => {
    try {
      const res = await axiosInstance.put(`/posts/like/${postId}`);
      const updatedPost = res.data.data.post;
      const isLiked = res.data.data.isLiked;
      setPost((prevPost) => ({
        ...prevPost,
        likesCount: updatedPost.likesCount,
        isLiked,
      }));
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const res =  await axiosInstance.post(`/posts/comment/${postId}`, {
              text: newComment,
            });
        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, res.data.comment],
        }));
        setNewComment("");
      } catch (err) {
        console.error("Error posting comment:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/posts/deleteComment/${id}`);
        setPost((prevPost) => ({
          ...prevPost,
          comments: prevPost.comments.filter((comment) => comment._id !== id),
        }));
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    }
  }
   

  if (!post) return <div>Loading...</div>;

  return (
    <div className="relative mx-auto p-[20px] max-w-4xl border border-black bg-white rounded-lg shadow-lg">
      <div className="container">
        <div className="p-1 m-2 rounded-full flex gap-4 items-center">
          <img
            className="h-12 w-12 border-2 border-black rounded-full object-cover"
            src={post.author.coverImage || blankProfile}
            alt="Profile"
          />
          <h2 className="text-xl font-medium">{post.author.username}</h2>
        </div>

        {post.multimedia && post.multimedia.endsWith(".mp4") ? (
          <video className="w-full rounded-lg shadow-lg mb-4" controls>
            <source src={post.multimedia} type="video/mp4" />
          </video>
        ) : (
          <img
            className="w-full rounded-lg shadow-lg mb-4"
            src={post.multimedia}
            alt=""
          />
        )}

        <p className="text-gray-700 mb-6">{post.content}</p>

        <div className="flex mb-6 p-2 gap-60">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white py-2 px-4 rounded-lg hover:bg-purple-700"
            onClick={handleLikeClick}
          >
            <FontAwesomeIcon icon={faHeart} />
            {post.isLiked ? "Liked" : "Like"} <span>({post.likesCount})</span>
          </button>

          <button className="flex items-center gap-2 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white py-2 px-4 rounded-lg hover:bg-purple-700">
            <FontAwesomeIcon icon={faComment} /> Comment{" "}
            <span>({post.comments.length})</span>
          </button>

          {/* <button className="flex items-center gap-2 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white py-2 px-4 rounded-lg hover:bg-purple-700">
            <FontAwesomeIcon icon={faShare} /> Share
          </button> */}
        </div>
      </div>

      <div className="comments-section">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">
          Comments ({post.comments.length})
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
                    {comment.user.username}:
                  </strong>{" "}
                  {comment.text}
                </div>
                {(comment.user._id === currentUser._id ||
                  currentUser.role === "admin") && (
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(comment._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleCommentSubmit} className="mt-6 flex gap-4">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostPage;
