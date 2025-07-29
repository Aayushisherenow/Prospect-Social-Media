import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axios.js";

const Signupform = () => {
  const [modalStatus, setModalStatus] = useState(true);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");



  const register = async (newUser) => {
    try {
      const res = await axiosInstance.post("users/register", newUser, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setServerError("");
          setSuccessMessage("User registered successfully!");

     setTimeout(() => {
       setModalStatus(false);
       navigate("/login");
     }, 1500);
    } catch (error) {
         const message =
      error.response?.data?.message || "Something went wrong. Please try again.";
            setServerError(message);
        
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const retypePassword = e.target.retypePassword.value.trim();
    const interestsRaw = e.target.interests.value.trim();
    const coverImage = e.target.coverImage.files[0];

    const errors = {};

    if (!username) errors.username = "Username is required.";
    if (!email) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    if (!retypePassword) errors.retypePassword = "Please retype your password.";
    if (!interestsRaw) errors.interests = "Please input some interests";

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if(username.length<6)errors.username="Username must be atleast 6 characters long"
    if (email && !emailRegex.test(email))
      errors.email = "Please enter a valid email address.";
    if (password && password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters long and contain at least one letter and one number.";
    }
    if (password !== retypePassword)
      errors.retypePassword = "Passwords do not match.";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (coverImage) formData.append("coverImage", coverImage);
    if (interestsRaw) {
      const interests = interestsRaw.split(",").map((item) => item.trim());
      interests.forEach((tag) => formData.append("interests[]", tag));
    }

    register(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen">
      {modalStatus && (
        <>
          <div
            className="fixed inset-0 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] bg-opacity-50 flex items-center justify-center z-40"
            onClick={() => {
              setModalStatus(false);
              navigate("/");
            }}
          ></div>

          <div className=" bg-gray-300 max-h-[90vh] overflow-y-auto px-8 py-8 rounded-lg shadow-lg z-50 max-w-md w-full flex flex-col items-center">
            <h2 className="text-4xl font-bold text-center text-black mb-12">
              Sign Up
            </h2>
            <span
              className="absolute top-4 right-4 text-2xl cursor-pointer"
              onClick={() => {
                setModalStatus(false);
                navigate("/");
              }}
              aria-label="Close modal"
            >
              &times;
            </span>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 w-full flex flex-col items-center"
            >
              <div className="w-full">
                {serverError && (
                  <div className="w-full bg-red-100 text-red-700 text-sm p-3 rounded mb-2 text-center">
                    {serverError}
                  </div>
                )}

                {successMessage && (
                  <div className="w-full bg-green-100 text-green-700 text-sm p-3 rounded mb-2 text-center">
                    {successMessage}
                  </div>
                )}

                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-900"
                >
                  Username
                </label>

                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                  placeholder="Enter your username"
                />
                {validationErrors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.username}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                  placeholder="you@example.com"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="relative w-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                  placeholder="••••••••"
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div className="relative w-full">
                <label
                  htmlFor="retypePassword"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Retype Password
                </label>
                <input
                  type="password"
                  id="retypePassword"
                  name="retypePassword"
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                  placeholder="••••••••"
                />
                {validationErrors.retypePassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.retypePassword}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="interests"
                  className="block text-sm font-medium text-gray-900"
                >
                  Interests (comma-separated)
                </label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                  placeholder="e.g. React, Node.js, MongoDB"
                />
                {validationErrors.interests && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.interests}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="coverImage"
                  className="block text-sm font-medium text-gray-900"
                >
                  Cover Image
                </label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/*"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg shadow-sm bg-white"
                />
              </div>

              <div className="w-full">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray mt-6">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-gray font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Signupform;
