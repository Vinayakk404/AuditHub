import React, { useState } from "react";
import NavigationBar from "../Components/Navbar";
import Header from "../Components/Header";
import VehicleTable from "../Components/VehicleTable";
import Inventory from "../Components/Inventory";
import Footer from "../Components/Footer";
import { FaBox, FaEye } from "react-icons/fa6";
import Logout from "../Components/Logout";
import { FaChartArea } from "react-icons/fa";
const InventoryPage = () => {
  // State to manage current view ('view' or 'add')
  const [currentView, setCurrentView] = useState("inventory");

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Tvs Motors</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => setCurrentView("inventory")}
            className={`flex items-center p-3 rounded-md transition-colors ${
              currentView === "inventory"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            <FaBox className="mr-2" />
            Inventory
          </button>
          <button
            onClick={() => setCurrentView("graphs")}
            className={`flex items-center p-3 rounded-md transition-colors ${
              currentView === "graphs"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            <FaChartArea className="mr-2" />
            Graphs
          </button>
          <Logout />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-gray-100 overflow-auto">
        {/* <NavigationBar /> */}
        <Header
          title="Welcome to Inventory"
          subText="Manage and  update vehicles"
        />
        <div className="container mx-auto p-4">
          {/* Conditionally render the views based on currentView state */}
          {currentView === "inventory" && <Inventory />}
          {/* <Footer /> */}
          {currentView === "graphs" && (
            <iframe
              src="http://localhost:3000/public/dashboard/e4ac352c-c4ab-4192-85c1-93d501eca393"
              frameborder="0"
              width="1100"
              height="1600"
              allowtransparency
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
