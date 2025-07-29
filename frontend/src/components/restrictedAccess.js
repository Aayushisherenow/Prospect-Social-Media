import React from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext"; // Assuming you have a context to manage user state

const Restricted = () => {
  const { user } = useUserContext(); // Access the user state from context
  const navigate = useNavigate();

  // Check if the user is already logged in
  React.useEffect(() => {
    // If the user is logged in, navigate to another page (e.g., /dashboard)
    if (user.isLoggedIn) {
      navigate("/"); // Example: Redirect to dashboard after login
    }
  }, [user, navigate]); // Dependencies: whenever the user or navigate changes, this effect runs

  const handleLogin = () => {
    // Assuming login process happens here (simulate login)
    // After successful login, redirect to the dashboard or home page
    navigate("/login"); // Example: redirect to dashboard after login
  };

  return (
    <div className="bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <Lock size={48} className="text-blue-500" />
        </div>
        <h1 className="text-2xl font-semibold">Access Restricted</h1>
        <p className="text-gray-600">Please log in to access this page.</p>
        <button
          className="w-full border rounded-lg bg-gray-900 text-white p-2 font-bold"
          onClick={handleLogin}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Restricted;
