import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

import { useUserContext } from "../../context/userContext.js";
import { axiosInstance } from "../../utils/axios.js"; // make sure this exists

const Loginform = () => {
  const [modalStatus, setModalStatus] = useState(true);
  const [passwordType, setPasswordType] = useState("password");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const { login: setUser } = useUserContext();

  const showPassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const login = async (loginUser) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("users/login", loginUser);
      // console.log(res.data.user);
      setUser(res.data.user); 
          setSuccessMessage("User logged in successfully!");
          setServerError("");

          setTimeout(() => {
            setModalStatus(false);
            navigate("/");
          }, 2000);



    } catch (error) {
      const message =
      error.response?.data?.message || "Something went wrong. Please try again.";
            setServerError(message);
    } 
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const errors = {};
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters long and contain at least one letter and one number.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    const loginUser = { email, password };
    login(loginUser);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center h-screen">
        {/* Modal Overlay */}
        {modalStatus && (
          <>
            <div
              className="fixed inset-0 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] bg-opacity-100 flex items-center justify-center z-40"
              onClick={() => {
                setModalStatus(false); // Close modal on overlay click
                navigate("/"); // Navigate to homepage
              }}
            ></div>

            {/* Modal Form */}
            <div className="fixed bg-gray-300 p-16 rounded-lg shadow-lg z-50 max-w-lg w-full transform transition-all duration-300">
              <h2 className="font-semibold text-4xl text-black text-center mb-12">
                Login
              </h2>
              <span
                className="absolute top-4 right-4 text-2xl cursor-pointer"
                onClick={() => {
                  setModalStatus(false); // Close modal
                  navigate("/"); // Navigate to homepage
                }}
                aria-label="Close modal"
              >
                &times;
              </span>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6 mt-6">
                <div>
                  {serverError && (
                    <div className="w-full bg-red-100 z-50 text-red-700 text-sm p-3 rounded mb-2 text-center">
                      {serverError}
                    </div>
                  )}

                  {successMessage && (
                    <div className="w-full bg-green-100 z-50 text-green-700 text-sm p-3 rounded mb-2 text-center">
                      {successMessage}
                    </div>
                  )}
                  
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
                    className="block text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    type={passwordType}
                    id="password"
                    name="password"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    placeholder="••••••••"
                  />
                  <span
                    onClick={showPassword}
                    className="absolute top-9 right-3  text-gray-500 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={passwordType === "password" ? faEye : faEyeSlash}
                    />
                  </span>
                  {validationErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  >
                    Login
                  </button>
                </div>
              </form>

              <p className="text-center text-sm text-gray mt-6">
                Don't have an account?{" "}
                <Link
                  to={"/signup"}
                  className="text-gray font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Loginform;
