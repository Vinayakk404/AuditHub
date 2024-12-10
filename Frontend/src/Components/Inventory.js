
import React, { useState, useEffect } from "react";
import VehicleCard from "./VehicleCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import axios from '../utils/axoisConfig'

const Inventory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [originalVehicles, setOriginalVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchId, setBatchId] = useState(0);
  const [anomalyCategory, setAnomalyCategory] = useState("");
  const [batchOptions, setBatchOptions] = useState([]);
  const [models, setModels] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [inputStock, setInputStock] = useState(0); // State for the input stock

  useEffect(() => {
    fetchVehicles();
  }, []);

  const location=useLocation();
  const isSales=location.pathname==="/sales"||location.pathname==="/Sales" || location.pathname==="/Production";
  const fetchVehicles = async () => {
    try {
      const response = await fetch("http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/inventory/inv",{
        
          method: 'GET',
          headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`, // notice the Bearer before your token
          },
      });
      // if (!response.ok) throw new Error("Failed to fetch vehicles");
      const data = await response.json();

      setOriginalVehicles(data); // Preserve the original data
      setVehicles(data); // Set the original vehicles
      setFilteredVehicles(data); // Initially set filtered vehicles to all

      // Extract unique models
      const uniqueModels = [
        ...new Set(data.map((vehicle) => vehicle.vehicleModel)),
      ];
      setModels(uniqueModels);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(`Error fetching data: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Function to group vehicles by vehicleId and sum stock
  const groupByVehicleId = (vehicles) => {
    const grouped = vehicles.reduce((acc, vehicle) => {
      if (!acc[vehicle.vehicleId]) {
        acc[vehicle.vehicleId] = { ...vehicle, stock: 0 };
      }
      acc[vehicle.vehicleId].stock += vehicle.stock; // Sum stock
      return acc;
    }, {});

    return Object.values(grouped);
  };

  // Handle search by model name
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter vehicles based on the model name
    if (term) {
      const filtered = originalVehicles.filter((vehicle) =>
        vehicle.vehicleModel.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredVehicles(filtered);

      // Get unique batch IDs for the filtered model
      const uniqueBatchIds = getUniqueBatchIds(filtered);
      setBatchOptions(uniqueBatchIds);

      // Set suggestions for autocomplete
      const modelSuggestions = models.filter((model) =>
        model.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(modelSuggestions);
    } else {
      setFilteredVehicles(originalVehicles);
      setBatchOptions([]);
      setSuggestions([]);
    }
  };

  // Function to get unique batch IDs and their stocks for the filtered vehicles
  const getUniqueBatchIds = (filtered) => {
    const batchMap = new Map();

    filtered.forEach((vehicle) => {
      if (!batchMap.has(vehicle.batchId)) {
        batchMap.set(vehicle.batchId, vehicle.stock); // Add new batchId with its stock
      } else {
        batchMap.set(
          vehicle.batchId,
          batchMap.get(vehicle.batchId) + vehicle.stock
        ); // Update stock if exists
      }
    });

    return Array.from(batchMap.entries()).map(([id, stock]) => ({
      batchId: id,
      stock,
    }));
  };

  // Handle selection of batch ID
  const handleBatchIdChange = (e) => {
    const selectedBatchId = e.target.value;
    setBatchId(selectedBatchId);

    // Reset the input stock when a new batch ID is selected
    const selectedBatch = batchOptions.find(
      (batch) => batch.batchId === selectedBatchId
    );
    if (selectedBatch) {
      setInputStock(0); // Reset input stock
    }
  };

  // Handle selection of anomaly category
  const handleAnomalyCategoryChange = (e) => {
    const selectedAnomaly = e.target.value;
    setAnomalyCategory(selectedAnomaly);
  };

  // Handle stock input change
  const handleStockInputChange = (e) => {
    setInputStock(e.target.value);
  };

  // Handle updating a vehicle's stock and anomaly
  const handleUpdateVehicle = async () => {
   
    // Ensure input stock does not exceed available stock
    const selectedBatch = batchOptions.find(batch => batch.batchId == batchId);
    console.log(selectedBatch)
    if (inputStock > Number(selectedBatch.stock)) {
      toast.error("Input stock must be less than or equal to the available stock for the selected batch.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
      
    
    let damagedStock = 0;
    let defectiveStock = 0;
    if (anomalyCategory == "Damaged Units") {
      damagedStock = inputStock;
    } else {
      defectiveStock = inputStock;
    }

    // Create an updated vehicle object
    const updatedVehicle = {

      stock: Number(inputStock), // Use input stock
      damagedStock : anomalyCategory==="Damaged Units"?Number(inputStock):0 ,
      defectiveStock : anomalyCategory==="Defective Units"?Number(inputStock):0,
    };
    console.log(updatedVehicle);
    console.log(batchId)

    try {
      const response = await axios.put(
        `http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/inventory/inv/${batchId}`,
         updatedVehicle);

      // if (!response.ok) throw new Error("Failed to update vehicle");
      fetchVehicles();
      // Update the vehicles state
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle.batchId === batchId ? updatedVehicle : vehicle
        )
      );

      toast.success("Vehicle updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset input fields after successful update
      setInputStock(0);
      setBatchId("");
      setAnomalyCategory("");
    setSearchTerm("")
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error(`Error updating vehicle: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Group the vehicles to prepare for display
  const groupedVehicles = groupByVehicleId(filteredVehicles);

  return (
    <div className="container mx-auto px-4 py-8 ">
                <h1 className="text-2xl font-bold mb-4">Vehicle Inventory</h1>
      <ToastContainer />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-6">
        {/* Search by Model Name */}
        <div className="flex-1 mb-4 md:mb-0 relative">
          <label
            htmlFor="search"
            className="block text-gray-700 font-semibold mb-2"
          >
            Search by Model Name
          </label>
          <input
            type="text"
            id="search"
            placeholder="Enter model name"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg">
              {suggestions.map((model, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearchTerm(model);
                    setSuggestions([]);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                >
                  {model}
                </li>
              ))}
            </ul>
          )}
        </div>

        { !isSales &&
        <div className="flex-1 mb-4 md:mb-0">
          <label
            htmlFor="batchId"
            className="block text-gray-700 font-semibold mb-2"
          >
            Select Batch ID
          </label>
          <select
            id="batchId"
            value={batchId}
            onChange={handleBatchIdChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Batch ID</option>
            {batchOptions.map(({ batchId, stock }) => (
              <option key={batchId} value={batchId}>
                {batchId} (Stock: {stock})
              </option>
            ))}
          </select>
        </div>
}
        { !isSales &&
        <div className="flex-1 mb-4 md:mb-0">
          <label
            htmlFor="inputStock"
            className="block text-gray-700 font-semibold mb-2"
          >
            Input Stock
          </label>
          <input
            type="number"
            id="inputStock"
            value={inputStock}
            onChange={handleStockInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="Enter new stock"
          />
        </div>
}
{ !isSales &&

       
        <div className="flex-1 mb-4 md:mb-0">
          <label
            htmlFor="anomalyCategory"
            className="block text-gray-700 font-semibold mb-2"
          >
            Select Anomaly Category
          </label>
          <select
            id="anomalyCategory"
            value={anomalyCategory}
            onChange={handleAnomalyCategoryChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Anomaly</option>
            <option value="Damaged Units">Damaged Units</option>
            <option value="Defective Units">Defective Units</option>
            {/* Add more anomaly categories as needed */}
          </select>
        </div>
}
      </div>

{!isSales &&
     
      <div className="mb-4">
        <button
          onClick={handleUpdateVehicle}
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={!batchId || !anomalyCategory || inputStock < 0}
        >
          Update
        </button>
      </div>
}
      {/* Vehicles List with Animation */}
      <AnimatePresence>
        {groupedVehicles.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
              hidden: {
                opacity: 0,
              },
            }}
          >
            {groupedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.vehicleId}
                vehicle={vehicle}
                stock={vehicle.stock} // Pass the total stock to the card
                onUpdate={handleUpdateVehicle}
              />
            ))}
          </motion.div>
        ) : (
          <motion.p
            className="text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No vehicles available.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
