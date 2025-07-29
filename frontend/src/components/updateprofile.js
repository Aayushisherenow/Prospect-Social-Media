import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axios.js";
import { useUserContext } from "../context/userContext.js";


const UpdateProfileForm = () => {
    const navigate = useNavigate();
          const { setUser } = useUserContext();


  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    coverImage: null,
  });

  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/currentUser");
        const user = res.data.data;
        setCoverImagePreview(user.coverImage || "");
        setFormValues((prev) => ({
          ...prev,
          username: user.username || "",
          email: user.email || "",
        }));
      } catch (error) {
        setServerError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValues.username.trim()) errors.username = "Username is required.";
    if (!formValues.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formValues.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
      }
      

    const formData = new FormData();
    formData.append("username", formValues.username.trim());
    formData.append("email", formValues.email.trim());
    if (formValues.coverImage)
      formData.append("coverImage", formValues.coverImage);

    try {
     const updatedUser = await axiosInstance.put("/users/updateAccountDetails", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
     });
        setSuccessMessage("Profile updated successfully!");
        setUser((prev) => ({
          isLoggedIn: true,
          username: updatedUser.data.data.username || prev.username,
          email: updatedUser.data.data.email || prev.email,
          coverImage: updatedUser.data.data.coverImage || prev.coverImage,
          _id: updatedUser.data.data._id || prev._id,
        }));

      setServerError("");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile.";
      setServerError(message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] px-4">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-gray-300 p-8 rounded-lg shadow-lg max-w-md w-full space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-black mb-4">
          Update Profile
        </h2>

        {serverError && (
          <div className="w-full bg-red-100 text-red-700 text-sm p-3 rounded text-center">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="w-full bg-green-100 text-green-700 text-sm p-3 rounded text-center">
            {successMessage}
          </div>
        )}

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-900"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formValues.username}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
          />
          {validationErrors.username && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formValues.email}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium text-gray-900"
          >
            Cover Image
          </label>
          {coverImagePreview && (
            <div className="mb-2">
              <img
                src={coverImagePreview}
                alt="Current Cover"
                className="w-full h-40 object-cover rounded"
              />
            </div>
          )}
          <input
            type="file"
            name="coverImage"
            id="coverImage"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormValues((prev) => ({
                  ...prev,
                  coverImage: file,
                }));
                setCoverImagePreview(URL.createObjectURL(file));
              }
            }}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
