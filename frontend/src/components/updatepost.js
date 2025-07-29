import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axios";

const UpdatePostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [multimedia, setMultimedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/posts/post/${postId}`);
        if (res.data && res.data.data) {
          setContent(res.data.data.content || "");
          setMultimedia(res.data.data.multimedia || null);
        } else {
          setError("Post not found");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load post: " + err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);

    if (multimedia) {
      formData.append("multimedia", multimedia);
    }

    try {
      const res = await axiosInstance.patch(
        `/posts/update/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data.data.content);
      if (res.status === 200) {
        window.alert("Post updated successfully!");
        // navigate(`/post/${postId}`);
        navigate(-1)
      } else {
        setError("Failed to update post");
      }
    } catch (err) {
      setError("Failed to update post: " + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Update Post</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post content..."
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-100 mb-2">
            Upload Multimedia (Image/Video)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            className="w-full border p-2 rounded"
            onChange={(e) => setMultimedia(e.target.files[0])}
          />
        </div>

        {/* If multimedia exists, display it */}
       {multimedia && (
  <div className="mt-4">
    {/* Check if multimedia is a URL string and ends with ".mp4" for video */}
    {typeof multimedia === "string" && multimedia.endsWith(".mp4") ? (
      <video controls className="w-full">
        <source src={multimedia} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : typeof multimedia === "string" ? (
      // Assume it's an image for any other string (image URL)
      <img
        src={multimedia}
        alt="Preview"
        className="w-full"
      />
    ) : multimedia instanceof File ? (
      // Handle file selection (image/video) if multimedia is a File object
      multimedia.type.includes("image") ? (
        <img
          src={URL.createObjectURL(multimedia)}
          alt="Preview"
          className="w-full"
        />
      ) : multimedia.type.includes("video") ? (
        <video controls className="w-full">
          <source
            src={URL.createObjectURL(multimedia)}
            type={multimedia.type}
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div>Unsupported file type</div>
      )
    ) : null}
  </div>
)}

        <button
          type="submit"
          className="bg-gray-100 text-black hover:bg-gray-900 hover:text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdatePostForm;
