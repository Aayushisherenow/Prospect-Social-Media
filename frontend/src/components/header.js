import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../uploads/prospect_logo.png";


import { useUserContext } from "../context/userContext";
import { axiosInstance } from "../utils/axios";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout ?");
    if (confirmed) {
      try {
        await axiosInstance.post("users/logout");
        logout();
        navigate("/login"); // Redirect to login page
      } catch (error) {
        console.error("Logout Error:", error);
      }
    }
  }
  

  return (
    <header className="fixed left-0 top-0 border rounded-r-lg h-full w-95 bg-white text-black shadow-lg flex flex-col py-6 px-4 mr-20 pr-10">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-32">
        <img src={logo} className="w-16 h-16" alt="Logo" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/"
          className="p-2 rounded-lg text-black hover:bg-black hover:text-white"
          activeClassName="bg-black text-white"
        >
          Home
        </NavLink>

        {user?.role !== "admin" && (
          <>
            <NavLink
              to="/contact"
              className="p-2 rounded-lg text-black hover:bg-black hover:text-white"
              activeClassName="bg-black text-white"
            >
              Contact
            </NavLink>
            <NavLink
              to="/about"
              className="p-2 rounded-lg text-black hover:bg-black hover:text-white"
              activeClassName="bg-black text-white"
            >
              About
            </NavLink>
          </>
        )}
        <NavLink
          to="/directMessage"
          className="p-2 rounded-lg text-black hover:bg-black hover:text-white"
          activeClassName="bg-black text-white"
        >
          Messages
        </NavLink>

        

        {user && user.isLoggedIn && (
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg mr-4 text-black hover:bg-black hover:text-white"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
