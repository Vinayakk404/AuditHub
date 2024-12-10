// src/pages/ProductionPlanPage.jsx

import React, { useState, useEffect } from "react";
import { VEHICLE_MODELS } from "../constants/vehicleModels";
import axios from "../utils/axoisConfig";
// import Header from "../components/Header";
import {
  FaAddressCard,
  FaBox,
  FaChartArea,
  FaChartBar,
  FaEye,
  FaGripLinesVertical,
} from "react-icons/fa6";
import ConfirmationModal from "../Components/ConfirmationModal";
import VehicleSelect from "../Components/VehicleSelect";
import CurrentPlans from "../Components/CurrentPlans";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
} from "recharts";
import { v4 as uuidv4 } from "uuid";
import { getDatesBetween } from "../utils/dateUtils"; // Utility function for dates
import { Pie } from "react-chartjs-2";
import Header from "../Components/Header";
import Inventory from "../Components/Inventory";
import ChartPages from "./ChartPages";
import Logout from "../Components/Logout";

// Define the shift options
const SHIFTS = [
  { name: "Shift 1", start: "09:00", end: "13:00" },
  { name: "Shift 2", start: "14:00", end: "18:00" },
  { name: "Shift 3", start: "19:00", end: "23:00" },
];


// Maximum units per plant per day
const PLANT_CAPACITY = 4000;

const ProductionPlan = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState([]); // Array of selected vehicles
  const [currentPlans, setCurrentPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null); // For confirmation modal
  const [budget, setBudget] = useState(0); // Real-time budget
  const [currentView, setCurrentView] = useState("viewVehicles");
  const [errorLabel, setErrorLabel] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentProduction, setCurrentProduction] = useState([]);
const [errorMessage,setErrorMessage]=useState("");
  
  const [planId, setPlanId] = useState(null);

  useEffect(() => {
    // Function to fetch the last plan ID
    const fetchLastPlanId = async () => {
      try {
        const response = await axios.get("http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/productionData/plans");
        const plans = response.data;
        
        if (plans && plans.length > 0) {
          const lastPlan = plans[plans.length - 1];
          setPlanId(lastPlan.planId);
        } else {
          console.log("No plans found.");
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    // Only fetch if currentView is "graphs"
    if (currentView === "graphs") {
      fetchLastPlanId();
    }
  }, [currentView]); // Runs when currentView changes


  // Fetch current plans from the database when component mounts
  useEffect(() => {
    fetchCurrentPlans();
   


  }, []);

  const fetchCurrentPlans = async () => {
    try {
      const response = await axios.get(
        "http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/productionData/plans"
      );
      setCurrentPlans(response.data);
      const repsonse2 = await axios.get(
        "http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/productionData"
      );
      setCurrentProduction(repsonse2.data);
    } catch (error) {
      console.error("Error fetching current plans:", error);
      toast.error("Failed to fetch current plans.");
    }
  };

  const totalDays =
    startDate && endDate ? getDatesBetween(startDate, endDate).length : 0;

  // Update budget whenever selectedVehicles or their units change
  useEffect(() => {
    const totalBudget = selectedVehicles.reduce((sum, vehicle) => {
      return (
        sum +
        (vehicle.plannedUnits
          ? vehicle.plannedUnits * vehicle.productionPrice * totalDays
          : 0)
      );
    }, 0);
    setBudget(totalBudget);
  }, [selectedVehicles]);

  // Calculate total days based on startDate and endDate

  // Calculate total units for the entire plan duration
  const totalUnits = selectedVehicles.reduce((sum, vehicle) => {
    return sum + (vehicle.plannedUnits ? vehicle.plannedUnits * totalDays : 0);
  }, 0);

  const todaysDate = () => {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + offset);

    // Format current IST date as YYYY-MM-DD
    const todayIST = istNow.toISOString().slice(0, 10);

    return todayIST;
    //  console.log(todayIST)
  };
  // Handle form submission to create a new plan
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!startDate || !endDate) {
      // toast.error("Please select both start and end dates.");
      setErrorLabel("Please select both start and end dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      // toast.error("Start date cannot be after end date.");
      setErrorLabel("Start date cannot be after end date.");

      return;
    }

    if (selectedVehicles.length === 0) {
      // toast.error("Please select at least one vehicle.");
      setErrorLabel("Please select at least one vehicle.");

      return;
    }

    if (selectedVehicles.length > 6) {
      // toast.error("You can select up to 6 vehicles.");
      setErrorLabel("You can select up to 6 vehicles.");

      return;
    }

    // Check that production units for each vehicle do not exceed 4000 per day
    for (let i = 0; i < selectedVehicles.length; i++) {
      const vehicle = selectedVehicles[i];
      if (!vehicle.plannedUnits || vehicle.plannedUnits < 1) {
        // toast.error(`Please enter a valid number of units for ${vehicle.label}.`);
        setErrorLabel(
          `Please enter a valid number of units for ${vehicle.label}.`
        );

        return;
      }
      if (vehicle.plannedUnits > 4000) {
        // toast.error(`Maximum units for ${vehicle.label} is 4000 per day.`);
        setErrorLabel(`Maximum units for ${vehicle.label} is 4000 per day.`);

        return;
      }
    }

    // Organize vehicles by plant and calculate total units per plant per day
    const plantUnitMap = {}; // { plant: totalUnitsPerDay }

    selectedVehicles.forEach((vehicle) => {
      const plant = vehicle.plant;
      if (!plantUnitMap[plant]) {
        plantUnitMap[plant] = 0;
      }
      plantUnitMap[plant] += Number(vehicle.plannedUnits);
    });

    // Validate capacity per plant per day
    for (const plant in plantUnitMap) {
      if (plantUnitMap[plant] > PLANT_CAPACITY) {
        toast.error(
          `Total production units for ${plant} exceed the maximum capacity of ${PLANT_CAPACITY} units per day.`
        );
        return;
      }
    }

    // Generate dates
    const dates = getDatesBetween(startDate, endDate);

    // Validate no overlapping manufacturing dates
    for (const vehicle of selectedVehicles) {
      for (const date of dates) {
        const formattedDate = date.toISOString().split("T")[0];
        const conflictingPlan = currentPlans.find(
          (plan) =>
            plan.vehicleModel === vehicle.label &&
            plan.plant === vehicle.plant &&
            plan.date === formattedDate
        );
        if (conflictingPlan) {
          toast.error(
            `Manufacturing for ${vehicle.label} in ${vehicle.plant} on ${formattedDate} already exists.`
          );
          return;
        }
      }
    }

    setLoading(true);

    // Create production plans
    let productionPlans = [];

    dates.forEach((date) => {
      SHIFTS.forEach((shift, index) => {
        selectedVehicles.forEach((vehicle) => {
          const unitsPerShift = Math.floor(
            vehicle.plannedUnits / SHIFTS.length
          );
          const remainder = vehicle.plannedUnits % SHIFTS.length; // Get the remainder

          productionPlans.push({
            vehicleId: getVehicleId(vehicle.label),
            vehicleModel: vehicle.label,
            plantId: vehicle.plant,
            date: date.toISOString().split("T")[0],
            shift: shift.name,
            plannedProductionUnits:
              unitsPerShift + (index === SHIFTS.length - 1 ? remainder : 0),
            productionStartTime: `${date.toISOString().split("T")[0]}T${
              shift.start
            }`,
            productionEndTime: `${date.toISOString().split("T")[0]}T${
              shift.end
            }`,
            status: "Pending",
          });
        });
        // console.log(productionPlans);
      });
    });

    // Adjust units for shifts to ensure total planned units match user input
    selectedVehicles.forEach((vehicle) => {
      const totalUnits = Number(vehicle.plannedUnits);
      const unitsPerShift = Math.floor(totalUnits / SHIFTS.length);
      const remainder = totalUnits % SHIFTS.length;

      dates.forEach((date) => {
        for (let i = 0; i < SHIFTS.length; i++) {
          const shift = SHIFTS[i];
          const index = productionPlans.findIndex(
            (plan) =>
              plan.vehicleModel === vehicle.label &&
              plan.plant === vehicle.plant &&
              plan.date === date.toISOString().split("T")[0] &&
              plan.shift === shift.name
          );
          if (index !== -1) {
            productionPlans[index].plannedProductionUnits = unitsPerShift;
            if (i === SHIFTS.length - 1) {
              productionPlans[index].plannedProductionUnits += remainder;
            }
          }
        }
      });
    });

    // Prepare payload for productionData database
    const payloadProductionData = {
      startDate,
      endDate,
      vehicles: selectedVehicles.map((vehicle) => vehicle.value),
      productionPlans,
    };

    // Prepare payload for plans database
    const payloadPlans = {
      startDate,
      endDate,
      vehicles: selectedVehicles.map((vehicle) => vehicle.value),
      totalUnits,
      budget,
    };

    try {
      // Send plan to the productionData backend in batch
      await axios.post(
        "http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/productionData/batch/bulkInsert",
        payloadProductionData.productionPlans
      );
      toast.success("Production plan saved to Production Data successfully!");

      // Send plan details to the plans backend
      await axios.post(
        "http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/productionData/plans",
        payloadPlans
      );
   

      // Prepare data for confirmation
      setConfirmationData(payloadProductionData.productionPlans);
      setModalVisible(true);
      {
        isModalVisible && (
          <ConfirmationModal
            data={confirmationData}
            onClose={() => setModalVisible(false)}
          />
        );
      }

      // Reset form
      setStartDate("");
      setEndDate("");
      setSelectedVehicles([]);
      setErrorLabel("");
      // Refresh current plans
      fetchCurrentPlans();
    } catch (error) {
      console.error("Error creating production plan:", error);
      toast.error("Failed to create production plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get production price based on vehicle model
  const getProductionPrice = (vehicleModel) => {
    const vehicle = VEHICLE_MODELS.find((v) => v.label === vehicleModel);
    return vehicle ? vehicle.productionPrice : 0;
  };

  // Helper function to get vehicle ID
  const getVehicleId = (vehicleModel) => {
    const vehicle = VEHICLE_MODELS.find((v) => v.label === vehicleModel);
    return vehicle ? vehicle.value : "";
  };

  // Prepare data for Recharts (Production Distribution by Shift)
  const chartData = [
    {
      shift: "Shift 1",
      Planned: currentPlans
        .filter((plan) => plan.shift === "Shift 1")
        .reduce((sum, plan) => sum + plan.plannedProductionUnits, 0),
      Actual: currentPlans
        .filter((plan) => plan.shift === "Shift 1")
        .reduce((sum, plan) => sum + (plan.actualProductionUnits || 0), 0),
    },
    {
      shift: "Shift 2",
      Planned: currentPlans
        .filter((plan) => plan.shift === "Shift 2")
        .reduce((sum, plan) => sum + plan.plannedProductionUnits, 0),
      Actual: currentPlans
        .filter((plan) => plan.shift === "Shift 2")
        .reduce((sum, plan) => sum + (plan.actualProductionUnits || 0), 0),
    },
    {
      shift: "Shift 3",
      Planned: currentPlans
        .filter((plan) => plan.shift === "Shift 3")
        .reduce((sum, plan) => sum + plan.plannedProductionUnits, 0),
      Actual: currentPlans
        .filter((plan) => plan.shift === "Shift 3")
        .reduce((sum, plan) => sum + (plan.actualProductionUnits || 0), 0),
    },
  ];

  return (
    <div className="flex h-screen  w-screen">
      <aside className=" w-64 bg-white shadow-md p-6 h-[2200px] overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">TVS MOTORS</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => setCurrentView("viewVehicles")}
            className={`flex items-center p-3 rounded-md transition-colors ${
              currentView === "viewVehicles"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            <FaEye className="mr-2" />
            Create Plans
          </button>
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

      {/* Header */}

      <div className=" w-full flex-1">
        <Header
          className=""
          title="Production Planner"
          subText="Create Something Amazing"
        />

        {currentView == "viewVehicles" && (
          <main className="flex-1 p-6 bg)-gray-100 overflow-auto">
            {/* Create Plan Form */}
            <section className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Create New Production Plan
              </h2>
              {errorMessage!="" && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Start Date */}

                <div>
                  <label className=" text-red-400">{errorLabel}</label>
                  <label
                    htmlFor="startDate"
                    class="block text-sm font-medium text-gray-700
                    starlabel "
                  >
                    Start Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setErrorLabel("");
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                
                    min={todaysDate()}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setErrorLabel("");
                    }}
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              
                    min={todaysDate()}
                  />
                </div>

                {/* Vehicle Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Vehicles (Up to 6)
                  </label>
                  <div
                    onClick={() => setErrorLabel("")}
                    className="cursor-pointer "
                  >
                    <VehicleSelect
                      selectedVehicles={selectedVehicles}
                      setSelectedVehicles={setSelectedVehicles}
                      maxSelection={6}
                    />
                  </div>
                </div>

                {/* Production Units Input */}
                {selectedVehicles.length > 0 && (
                  <div className="space-y-4">
                    {selectedVehicles.map((vehicle, index) => (
                      <div
                        key={vehicle.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="w-1/4 text-black font-normal" >{vehicle.label}:</span>
                          <input
                            type="number"
                            min="1"
                            max="4000"
                            placeholder="Enter production units per day (max 4000)"
                            value={vehicle.plannedUnits || ""}
                            onChange={(e) => {
                              const units = e.target.value;
                              if (units > 4000) {
                                toast.error(
                                  "Maximum units per vehicle model is 4000 per day."
                                );
                              
                                return;
                              }
                              const updatedVehicles = [...selectedVehicles];
                              updatedVehicles[index].plannedUnits = units;
                              setSelectedVehicles(updatedVehicles);
                            }}
                            className="mt-1 p-2 border border-gray-300 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        {/* Read-Only Fields: Plant, Price, Total Units, Total Cost */}
                        <div className="flex space-x-4">
                          {/* Plant */}
                          <div className="w-1/4">
                            <label className="block text-xl font-medium text-gray-700">
                              Plant
                            </label>
                            <input
                              type="text"
                              value={vehicle.plant}
                              readOnly
                              className="mt-1 p-2 border border-gray-300 rounded bg-gray-100 w-full"
                            />
                          </div>
                          {/* Production Price */}
                          <div className="w-1/4">
                            <label className="block text-sm font-medium text-gray-700">
                              Production Price (₹)
                            </label>
                            <input
                              type="text"
                              value={`₹${vehicle.productionPrice.toLocaleString()}`}
                              readOnly
                              className="mt-1 p-2 border border-gray-300 rounded bg-gray-100 w-full"
                            />
                          </div>
                          {/* Total Units */}
                          <div className="w-1/4">
                            <label className="block text-sm font-medium text-gray-700">
                              Total Units
                            </label>
                            <input
                              type="text"
                              value={
                                vehicle.plannedUnits && totalDays
                                  ? (
                                      Number(vehicle.plannedUnits) * totalDays
                                    ).toLocaleString()
                                  : "0"
                              }
                              readOnly
                              className="mt-1 p-2 border border-gray-300 rounded bg-gray-100 w-full"
                            />
                          </div>
                          {/* Total Cost */}
                          <div className="w-1/4">
                            <label className="block text-sm font-medium text-gray-700">
                              Total Cost (₹)
                            </label>
                            <input
                              type="text"
                              value={
                                vehicle.plannedUnits && totalDays
                                  ? `₹${(
                                      Number(vehicle.plannedUnits) *
                                      vehicle.productionPrice *
                                      totalDays
                                    ).toLocaleString()}`
                                  : "₹0"
                              }
                              readOnly
                              className="mt-1 p-2 border border-gray-300 rounded bg-gray-100 w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Real-time Budget and Total Units Display */}
                {selectedVehicles.length > 0 && (
                  <div>
                    <p className="text-md text-gray-700 mt-5">
                      <strong>Budget:</strong> ₹{budget.toLocaleString()}
                    </p>
                    <p className="text-md text-gray-700 mt-3">
                      <strong>Total Units (Entire Plan Duration):</strong>{" "}
                      {totalUnits.toLocaleString()} units
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Creating Plan..." : "Create Plan"}
                  </button>
                </div>
              </form>
            </section>

            {/* Confirmation Modal */}
            {isModalVisible && (
              <ConfirmationModal
                data={confirmationData}
                onClose={() => setModalVisible(false)}
              />
            )}
          </main>
        )}

        {currentView == "graphs" &&
      
        (
          <>
         
            <iframe
              src={`http://localhost:3000/public/dashboard/509f527b-1023-4613-bace-65b4133e5477?planid=${planId}#refresh=5`}
              frameborder="0"
              width="1200"
              height="1600"
              allowtransparency
              allowFullScreen
            ></iframe>
            <ChartPages />

            {/* Data Visualization */}
            <section className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Production Distribution by Shift
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shift" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Planned" fill="#3b82f6" name="Planned Units" />
                  <Bar dataKey="Actual" fill="#10b981" name="Actual Units" />
                </BarChart>
              </ResponsiveContainer>
            </section>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={currentPlans}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="planId" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#8884d8" name="Budget (₹)" />
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={currentPlans}
                  dataKey="totalUnits"
                  nameKey="planId"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#82ca9d"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            {/* Current Plans */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Current Production Plans
              </h2>
              <CurrentPlans plans={currentProduction} />
            </section>
          </>
        )}

        {currentView == "inventory" && (
          <>
            <Inventory />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductionPlan;
