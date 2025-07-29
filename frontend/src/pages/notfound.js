import React from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertTriangle size={48} className="text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-lg text-gray-600">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <button
          className="w-full border rounded-lg bg-gray-900 text-white p-2 font-bold"
          onClick={() => navigate("/")}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
