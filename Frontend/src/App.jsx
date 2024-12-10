// src/App.jsx
import "./index.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import QualityControlPage from "./Pages/QualityControlPage";
import Inventory from "./Pages/InventoryPage";
import PlantManagerPage from "./Pages/PlantManagerPages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SalesPage2 from "./Pages/SalesPage2";
import ProtectedRoute from "./Pages/ProtectedRoute";
import Login2 from "./Components/Login2";
import ProductionPlan from "./Pages/ProductionPlan";
const App = () => {
  return (
    <div className="flex h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      <Routes>
        {/* Main Content Area */}
        <Route path="/login" element={<Login2 />} />
        {/* Route for HomePage */}
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/Production" element={<ProductionPlan />} />
          <Route path="/plant/:plantId" element={<PlantManagerPage />} />
          <Route path="/Quality" element={<QualityControlPage />} />
          <Route path="/Inventory" element={<Inventory />} />
          <Route path="/Sales" element={<SalesPage2 />} />
        </Route>
        {/* Fallback Route */}
        <Route path="/unauthorized" element={<h1>UnAuthorized</h1>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
