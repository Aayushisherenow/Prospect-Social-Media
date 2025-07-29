import React, { useState, useRef } from "react";
import { UilScenery, UilShareAlt, UilTimes } from "@iconscout/react-unicons";
import { useUserContext } from "../../context/userContext.js";
import defaultProfile from "../../uploads/blank_profile.png";
import { axiosInstance } from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const PostShare = () => {
  const [media, setMedia] = useState(null);
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const mediaRef = useRef();

  const { user } = useUserContext();
  const navigate = useNavigate();

  const onMediaChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setMedia({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!text.trim() && !media) {
      errors.content = "Post content or media is required.";
    }
    if (!tags.trim()) {
      errors.tags = "Tags are required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    
   try {
  let response;

  if (media) {
    const formData = new FormData();
    formData.append("content", text.trim());
    formData.append("tags", tags);
    formData.append("multimedia", media.file);

    response = await axiosInstance.post("posts/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    const payload = {
      content: text.trim(),
      tags,
    };

    response = await axiosInstance.post("posts/create", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  setText("");
  setTags("");
  setMedia(null);
  toast.success("Post created successfully!");
  navigate("/");

} catch (error) {
  console.error("Post Error:", error.response?.data || error.message);
  toast.error("Failed to create post. Try again.");
}

    };
  


  return (
    <>
      <form onSubmit={handleShare} encType="multipart/form-data">
        <div className="flex gap-4 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] dark:bg-gray-800 p-4 max-w-4xl mx-auto mb-4 rounded-xl shadow-sm">
          <img
            src={user.coverImage || defaultProfile}
            alt="Profile"
            className="rounded-full w-12 h-12 object-cover"
          />

          <div className="flex flex-col gap-4 w-full">
            <input
              type="text"
              name="content"
              placeholder="What's on your mind?"
              className="bg-gray-200 rounded-lg p-3 text-base focus:outline-none placeholder:text-gray-600"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {validationErrors.content && (
              <p className="text-red-500 text-sm">{validationErrors.content}</p>
            )}

            {(text.trim() || media) && (
              <>
                <input
                  type="text"
                  name="tags"
                  placeholder="Enter tags (comma separated)"
                  className="bg-gray-200 rounded-lg p-3 text-base focus:outline-none placeholder:text-gray-600"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                {validationErrors.tags && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.tags}
                  </p>
                )}
              </>
            )}

            <div className="flex justify-between items-center gap-2">
              <div
                className="flex items-center gap-2 text-sm text-white hover:cursor-pointer hover:bg-gray-200 hover:text-black px-3 py-1 rounded-lg"
                onClick={() => mediaRef.current.click()}
              >
                <UilScenery />
                Add Media
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 hover:text-black"
              >
                <UilShareAlt />
                Share
              </button>

              <input
                type="file"
                accept="image/*,video/*"
                ref={mediaRef}
                onChange={onMediaChange}
                className="hidden"
              />
            </div>

            {media && (
              <div className="relative mt-2">
                <UilTimes
                  className="absolute z-20 right-4 top-2 cursor-pointer text-white bg-black bg-opacity-50 rounded-full p-1"
                  size="25"
                  onClick={() => setMedia(null)}
                />
                {media.file.type.startsWith("image") ? (
                  <img
                    src={media.url}
                    alt="Preview"
                    className="w-full max-h-80 object-cover rounded-md mt-2"
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="w-full max-h-80 object-cover rounded-md mt-2"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default PostShare;
