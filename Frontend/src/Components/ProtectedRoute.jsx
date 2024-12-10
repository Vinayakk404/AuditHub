// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Get user role to determine redirection
  const role = getUserRole();

  // Define role-based redirection paths
  const rolePaths = {
    admin: "/admin",
    operator: "/operator",
    quality: "/quality",
    inventory: "/inventory",
    sales: "/sales",
    // Add more roles and paths as needed
  };

  // If already on a role-specific page, allow access
  // Else, redirect based on role
  const currentPath = window.location.pathname;
  const assignedPath = rolePaths[role] || "/";

  if (!currentPath.startsWith(assignedPath)) {
    return <Navigate to={assignedPath} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
