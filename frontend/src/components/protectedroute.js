import React from "react";
import { useUserContext } from "../context/userContext";
import Restricted from "./restrictedAccess.js";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserContext();

  // Show Restricted screen if user is not logged in
  if (!user || !user.isLoggedIn) {
    return <Restricted />;
  }

  // Else, render the protected page
  return children;
};

export default ProtectedRoute;
