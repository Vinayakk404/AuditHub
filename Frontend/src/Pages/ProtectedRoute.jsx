// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const allowedRoles = [
    "Production",
    "Sales",
    "Inventory",
    "Quality",
    "Plant",
    "Planner1",
    "Planner2",
    "Planner3",
  ];

  const location = useLocation();
  console.log(location.pathname);
  const roles = [
    {
      username: "ProductionManager",
      role: "Production",
      localStorageRole: "Production",
      path: "/Production",
    },
    {
      username: "Planner1",
      role: "Planner1",
      localStorageRole: "Planner1",
      path: "/plant/Plant-1",
    },
    {
      username: "Planner2",
      role: "Planner2",
      localStorageRole: "Planner2",
      path: "/plant/Plant-2",
    },
    {
      username: "Planner3",
      role: "Planner3",
      localStorageRole: "Planner3",
      path: "/plant/Plant-3",
    },
    {
      username: "InventoryManager",
      role: "Inventory",
      localStorageRole: "Inventory",
      path: "/inventory",
    },
    {
      username: "SalesManager",
      role: "Sales",
      localStorageRole: "Sales",
      path: "/sales",
    },
    {
      username: "QualityManager",
      role: "Quality",
      localStorageRole: "Quality",
      path: "/Quality",
    },
  ];

  if (!token) {
    return <Navigate to="/login" />;
  }
  const decodedToken = jwtDecode(token);
  const username = decodedToken.sub;
  console.log(username);

  const userRole = roles.find(
    (item) =>
      item.username === username &&
      item.role === role &&
      item.path === location.pathname
  );
  console.log(userRole);

  if (userRole == undefined) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
