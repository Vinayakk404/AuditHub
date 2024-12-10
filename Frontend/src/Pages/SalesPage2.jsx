import React, { useState } from "react";
import Header from "../Components/Header";
import VehicleTable from "../Components/VehicleTable";
import Inventory from "../Components/Inventory";
import { FaBox, FaEye } from "react-icons/fa6";
import SalesPage from "./SalesForm";
import { FaRupeeSign, FaSellcast } from "react-icons/fa";
import Logout from "../Components/Logout";
const SalesPage2 = () => {
  const [currentView, setCurrentView] = useState("salePanel");

  return (
    <>
      <div className="flex h-screen w-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Tvs Motors</h2>
          <nav className="flex flex-col space-y-4 mt-14 ">
            <button
              onClick={() => setCurrentView("salePanel")}
              className={`flex items-center p-3 rounded-md transition-colors text-center ${
                currentView === "salePanel"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              <FaRupeeSign className="mr-1" />
              Sale Panel
            </button>
            <button
              onClick={() => setCurrentView("inventory")}
              className={`flex items-center p-3  rounded-md transition-colors ${
                currentView === "inventory"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              <FaBox className="mr-2" />
              Inventory
            </button>
            <Logout />
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-10 bg-gray-100 overflow-auto w-screen">
          {/* <NavigationBar /> */}
          <header className="text-center my-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Sales Dashboard
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Lets make some money !{" "}
            </p>
          </header>
          <div className="container mx-auto p-4">
            {currentView === "salePanel" && <SalesPage />}
            {currentView === "inventory" && <Inventory />}
            {/* <Footer /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesPage2;
