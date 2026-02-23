import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children; // User is logged in → show the page
};

export default ProtectedRoute;
