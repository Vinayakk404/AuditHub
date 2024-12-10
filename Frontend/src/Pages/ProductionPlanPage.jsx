// src/components/ProductionPlanPage.jsx

import React, { useState, useEffect } from "react";
import { VEHICLE_MODELS } from "../constants/vehicleModels";
import axios from "../utils/axoisConfig"; // Ensure correct path and spelling
import Header from "../Components/Header";
import { toast } from "react-toastify";

// Define the mapping from vehicle models to vehicle IDs
const VEHICLE_ID_MAPPING = {
  "Apache RTR 160": "V101",
  "Apache RTR 200": "V102",
  "TVS Ntorq": "V103",
  "Tvs Jupiter": "V104",
  "Star City": "V105",
};

// Define the operator options
const OPERATORS = ["OP101", "OP102", "OP103", "OP104"];

// Define the mapping from vehicle models to production line options
const PRODUCTION_LINE_OPTIONS = {
  "Apache RTR 160": ["Line 1", "Line 2"],
  "Apache RTR 200": ["Line 3", "Line 4"],
  "TVS Ntorq": ["Line 5", "Line 6"],
  "Tvs Jupiter": ["Line 7", "Line 8"],
  "Star City": ["Line 9", "Line 10"],
};

// Define the mapping from shift to start times
const SHIFT_START_TIMES = {
  Morning: "09:00",
  Afternoon: "14:00",
  Evening: "19:00",
  Night: "23:00",
};

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `0${today.getMonth() + 1}`.slice(-2);
  const day = `0${today.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

const ProductionPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    planId: "",
    durationDays: "",
    budget: "",
    vehicles: [],
  });

  // Fetch all production plans when the component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/productionData/plans"
        );
        const data = response.data;
        setPlans(data);

        // If there are plans, select the first one by default
        if (data.length > 0) {
          setSelectedPlanId(data[0].planId);
          setSelectedPlan(data[0]);
          initializeFormData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to fetch production plans.");
      }
    };

    fetchPlans();
  }, []);

  // Initialize form data based on the selected plan
  const initializeFormData = (plan) => {
    setFormData({
      planId: plan.planId,
      durationDays: plan.days,
      budget: plan.budget,
      vehicles:
        plan.vehicles && plan.vehicles.length > 0
          ? plan.vehicles.map((vehicle) => ({
              planId: plan.planId,
              vehicleModel: vehicle.vehicleModel || "",
              productionLine: vehicle.productionLine || "",
              shift: vehicle.shift || "Morning",
              plannedProductionUnits: vehicle.plannedProductionUnits || "",
              productionStartTime: vehicle.productionStartTime || "",
              operatorId: vehicle.operatorId || "",
              vehicleId: vehicle.vehicleId || "",
              comments: vehicle.comments || "",
            }))
          : [
              {
                planId: plan.planId,
                vehicleModel: "",
                productionLine: "",
                shift: "Morning",
                plannedProductionUnits: "",
                productionStartTime: "", // Will be set based on shift
                operatorId: "",
                vehicleId: "",
                comments: "",
              },
            ],
    });
  };

  // Handle plan selection from the sidebar
  const onSelectPlan = (planId) => {
    const plan = plans.find((p) => p.planId === planId);
    if (plan) {
      setSelectedPlanId(planId);
      setSelectedPlan(plan);
      initializeFormData(plan);
    }
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVehicles = [...formData.vehicles];
    updatedVehicles[index][name] = value;

    // Auto-set productionStartTime based on shift
    if (name === "shift") {
      const todayDate = getTodayDate();
      const shiftTime = SHIFT_START_TIMES[value];
      updatedVehicles[index].productionStartTime = `${todayDate}T${shiftTime}`;
    }

    // Auto-assign vehicleId based on vehicleModel and reset productionLine
    if (name === "vehicleModel") {
      updatedVehicles[index].vehicleId = VEHICLE_ID_MAPPING[value] || "";
      updatedVehicles[index].productionLine = ""; // Reset productionLine when vehicleModel changes

      // Reset productionStartTime based on current shift
      const currentShift = updatedVehicles[index].shift;
      const todayDate = getTodayDate();
      const shiftTime = SHIFT_START_TIMES[currentShift];
      updatedVehicles[index].productionStartTime = `${todayDate}T${shiftTime}`;
    }

    setFormData({ ...formData, vehicles: updatedVehicles });
  };

  const addVehicle = () => {
    const todayDate = getTodayDate();
    const defaultShift = "Morning";
    const shiftTime = SHIFT_START_TIMES[defaultShift];
    setFormData({
      ...formData,
      vehicles: [
        ...formData.vehicles,
        {
          planId: formData.planId,
          vehicleModel: "",
          productionLine: "",
          shift: defaultShift,
          plannedProductionUnits: "",
          productionStartTime: `${todayDate}T${shiftTime}`,
          operatorId: "",
          vehicleId: "",
          comments: "",
        },
      ],
    });
  };

  const removeVehicle = (index) => {
    const updatedVehicles = [...formData.vehicles];
    updatedVehicles.splice(index, 1);
    setFormData({ ...formData, vehicles: updatedVehicles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    for (let i = 0; i < formData.vehicles.length; i++) {
      const vehicle = formData.vehicles[i];
      if (
        !vehicle.vehicleModel ||
        !vehicle.plannedProductionUnits ||
        !vehicle.operatorId ||
        !vehicle.vehicleId ||
        !vehicle.productionLine ||
        !vehicle.productionStartTime
      ) {
        toast.error(`Please fill all required fields for Vehicle ${i + 1}.`);
        return;
      }
    }

    // Prepare data for backend
    const payload = {
      planId: formData.planId,
      durationDays: formData.durationDays,
      budget: formData.budget,
      productionData: formData.vehicles.map((vehicle) => ({
        planId: vehicle.planId,
        vehicleModel: vehicle.vehicleModel,
        productionLine: vehicle.productionLine,
        shift: vehicle.shift,
        plannedProductionUnits: Number(vehicle.plannedProductionUnits),
        productionStartTime: vehicle.productionStartTime,
        status: "Planned", // Initial status
        operatorId: vehicle.operatorId,
        vehicleId: vehicle.vehicleId,
        comments: vehicle.comments,
      })),
    };

    try {
      await axios.post(
        "http://localhost:8080/api/productionData/batch/bulkInsert",
        payload.productionData
      );

      toast.success("Data successfully sent!");
      // Optionally reset the form or update parent state
      // If needed, you can re-fetch the plans to reflect updates
      // fetchPlans(); // Uncomment if you want to refresh the plans
      console.log("Submitted Payload:", payload);
    } catch (error) {
      console.error("Failed to submit the plan:", error);
      toast.error(
        "Failed to submit the plan: " +
          (error.response?.data?.message || error.message)
      );
      console.log("Submitted Payload:", payload);
    }
  };

  return (
    <div className="flex w-full ">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen border-r border-gray-200 bg-white ">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-16 text-center">
            Production Plans
          </h1>
          {plans.length === 0 ? (
            <p className="text-center text-gray-500">No plans available.</p>
          ) : (
            <ul>
              {plans.map((plan) => (
                <li key={plan.planId} className="mb-2">
                  <button
                    onClick={() => onSelectPlan(plan.planId)}
                    aria-current={
                      selectedPlanId === plan.planId ? "page" : undefined
                    }
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-between ${
                      selectedPlanId === plan.planId
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-blue-100"
                    }`}
                  >
                    <span>Plan {plan.planId}</span>
                    <span className="text-md">Budget: ₹{plan.budget}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        {selectedPlan ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Plan {formData.planId} Details
            </h2>
            <div className="mb-6">
              <label className="block mb-2">
                Duration (Days):
                <input
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={(e) =>
                    setFormData({ ...formData, durationDays: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </label>
              <label className="block">
                Budget ($):
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </label>
            </div>

            {formData.vehicles.map((vehicle, index) => (
              <div
                key={index} // Use index as key since vehicles might not have unique IDs initially
                className="mb-6 p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Vehicle {index + 1}
                  </h3>
                  {formData.vehicles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      className="text-red-500 hover:text-red-700 text-2xl font-bold"
                      aria-label={`Remove Vehicle ${index + 1}`}
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vehicle Model */}
                  <label className="block">
                    Vehicle Model:
                    <select
                      name="vehicleModel"
                      value={vehicle.vehicleModel}
                      onChange={(e) => handleChange(index, e)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Model</option>
                      {VEHICLE_MODELS.map((model) => (
                        <option key={model.value} value={model.value}>
                          {model.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Production Line */}
                  <label className="block">
                    Production Line:
                    <select
                      name="productionLine"
                      value={vehicle.productionLine}
                      onChange={(e) => handleChange(index, e)}
                      className={`mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        vehicle.vehicleModel === ""
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                      required
                      disabled={vehicle.vehicleModel === ""}
                    >
                      <option value="">
                        {vehicle.vehicleModel === ""
                          ? "Select Vehicle Model First"
                          : "Select Production Line"}
                      </option>
                      {vehicle.vehicleModel &&
                        PRODUCTION_LINE_OPTIONS[vehicle.vehicleModel]?.map(
                          (line) => (
                            <option key={line} value={line}>
                              {line}
                            </option>
                          )
                        )}
                    </select>
                  </label>

                  {/* Shift */}
                  <label className="block">
                    Shift:
                    <select
                      name="shift"
                      value={vehicle.shift}
                      onChange={(e) => handleChange(index, e)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </label>

                  {/* Planned Production Units */}
                  <label className="block">
                    Planned Production Units:
                    <input
                      type="number"
                      name="plannedProductionUnits"
                      value={vehicle.plannedProductionUnits}
                      onChange={(e) => handleChange(index, e)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </label>

                  {/* Production Start Time */}
                  <label className="block">
                    Production Start Time:
                    <input
                      type="datetime-local"
                      name="productionStartTime"
                      value={vehicle.productionStartTime}
                      className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                      required
                    />
                  </label>

                  {/* Operator ID */}
                  <label className="block">
                    Operator ID:
                    <select
                      name="operatorId"
                      value={vehicle.operatorId}
                      onChange={(e) => handleChange(index, e)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Operator</option>
                      {OPERATORS.map((operator) => (
                        <option key={operator} value={operator}>
                          {operator}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Vehicle ID */}
                  <label className="block">
                    Vehicle ID:
                    <input
                      type="text"
                      name="vehicleId"
                      value={vehicle.vehicleId}
                      readOnly
                      className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100"
                    />
                  </label>

                  {/* Comments */}
                  <label className="block col-span-2">
                    Comments:
                    <textarea
                      name="comments"
                      value={vehicle.comments}
                      onChange={(e) => handleChange(index, e)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    ></textarea>
                  </label>
                </div>
              </div>
            ))}

            <div className="mb-6">
              <button
                type="button"
                onClick={addVehicle}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Vehicle
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit Plan
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-gray-500">
            Select a plan to view details.
          </p>
        )}
      </main>
    </div>
  );
};

export default ProductionPlanPage;
