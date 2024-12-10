// src/components/QualityControlPage.jsx
import React, { useState, useEffect } from "react";
import { VEHICLE_MODELS } from "../constants/vehicleModels";
import Header from "../Components/Header";
import {
  FaEye,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaChartArea,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../utils/axoisConfig";
import Logout from "../Components/Logout";
import { jwtDecode } from "jwt-decode";

const QualityControlPage = () => {
  const ANOMALY_REASONS = [
    "Non-Functional Components",
    "Safety Standard Non-Compliance",
    "Quality Defect",
    "Incorrect Assembly",
    "Other",
  ];
  const [loss, setLoss] = useState(0);
  const [amountLoss, setTotalLoss] = useState(0);

  // State to manage form data
  const [formData, setFormData] = useState({
    planId: 0,
    batchId: "",
    vehicleModel: "Apache RTR 160",
    producedUnits: "",
    qcPassedUnits: "",
    qcFailedUnits: "",
    qcFailureRate: "",
    anomalyFlag: false,
    anomalyType: "",
    shift: "Shift-1",
    qualityStartTime: "",
    qualityEndTime: "",
    productionEndTime: "",
    amountLoss: 0,
  });

  // State to manage vehicle list
  const [vehicles, setVehicles] = useState([]);
  const [penalty, setPenalty] = useState(0);

  // State to manage messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State to manage current view ('view' or 'add')
  const [currentView, setCurrentView] = useState("view");

  // State to manage if form is in 'add' or 'update' mode
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // State to track which vehicle is being updated
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Define the mapping from shift to start times
  const SHIFT_START_TIMES = {
    "Shift-1": "09:00",
    "Shift-2": "14:00",
    "Shift-3": "19:00",
  };

  const productionPrice = {
    "Apache RTR 160": 75000,
    "Apache RTR 200": 65000,
    "TVS Ntorq": 50000,
    "TVS Jupiter": 55000,
    "Star City": 45000,
    "TVS XL100": 40000,
    "TVS iQube Electric": 100000,
    "TVS Raider": 85000,
  };

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to get current datetime in YYYY-MM-DDTHH:MM format
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Effect to update quality start time automatically when production end time changes
  useEffect(() => {
    if (formData.productionEndTime) {
      const prodEnd = new Date(formData.productionEndTime);
      const qcStart = new Date(prodEnd);
      qcStart.setDate(qcStart.getDate() + 1);
      qcStart.setHours(qcStart.getHours() + 5);
      qcStart.setMinutes(qcStart.getMinutes() + 30);
      setFormData((prevState) => ({
        ...prevState,
        qualityStartTime: qcStart.toISOString().slice(0, 16), // Format as 'YYYY-MM-DDTHH:MM' for datetime-local
      }));
    }
  }, [formData.productionEndTime]);

  // Automatically set qualityStartTime and qualityEndTime based on shift
  useEffect(() => {
    const todayDate = getTodayDate();
    const shiftTime = SHIFT_START_TIMES[formData.shift];
    const startTime = `${todayDate}T${shiftTime}`;
    const endTimeDate = new Date(
      new Date(startTime).getTime() + 24 * 60 * 60 * 1000
    );
    const endTime = `${endTimeDate.getFullYear()}-${String(
      endTimeDate.getMonth() + 1
    ).padStart(2, "0")}-${String(endTimeDate.getDate()).padStart(
      2,
      "0"
    )}T${String(endTimeDate.getHours()).padStart(2, "0")}:${String(
      endTimeDate.getMinutes()
    ).padStart(2, "0")}`;
    setFormData((prevData) => ({
      ...prevData,
      qualityEndTime: endTime,
    }));
  }, [formData.shift]);

  async function fetchProductionData() {
    try {
      const response = await axios.get(
        "http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/qc/productionData"
      );
      setVehicles(response.data);
      console.log(vehicles);
    } catch (error) {
      toast.error("Error fetching production data:", error);
      // Optionally, you can rethrow the error if you want calling code to handle it
      // throw error;
    }
  }
  // Fetch QC Production Data
  useEffect(() => {
    fetchProductionData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Handle shift changes
    if (name === "shift") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Handle anomaly flag
    else if (name === "anomalyFlag") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
        anomalyType: checked ? prevData.anomaly : "",
        comments: "", // Reset comment when flag changes
      }));
    }
    // Handle QC Passed Units
    else if (name === "qcPassedUnits") {
      setErrorMessage("");
      const producedUnits = parseInt(formData.producedUnits, 10);
      const passedUnits = parseInt(value, 10);
      if (producedUnits < passedUnits) {
        setErrorMessage("Qc passed units cant be more than produced units  ");
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          qcPassedUnits: 0,
          qcFailedUnits: 0,
        }));

        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        qcFailedUnits:
          !isNaN(passedUnits) && !isNaN(producedUnits)
            ? producedUnits - passedUnits
            : "",
      }));
    }
    // Handle QC Failed Units
    else if (name === "qcFailedUnits") {
      const producedUnits = parseInt(formData.producedUnits, 10);
      const failedUnits = parseInt(value, 10);

      const qcFailureRate =
        !isNaN(failedUnits) && !isNaN(producedUnits) && producedUnits !== 0
          ? ((failedUnits / producedUnits) * 100).toFixed(2)
          : "";

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        qcFailureRate,
        qcPassedUnits:
          !isNaN(failedUnits) && !isNaN(producedUnits)
            ? producedUnits - failedUnits
            : "",
      }));
    }
    // Handle quality start and end times
    else if (name === "qualityStartTime" || name === "qualityEndTime") {
      const startTime =
        name === "qualityStartTime" ? value : formData.qualityStartTime;
      const endTime =
        name === "qualityEndTime" ? value : formData.qualityEndTime;
      const productionEndTime = formData.productionEndTime;

      // Ensure qualityStartTime is not after qualityEndTime
      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start > end) {
          setErrorMessage(
            "Quality start time must be before quality end time."
          );
          setFormData((prevData) => ({
            ...prevData,
            [name]: value,

            qcEndTime: "",
          }));

          return;
        }
        setErrorMessage("");
      }

      // Ensure quality times are not before productionEndTime
      if (productionEndTime) {
        const productionEnd = new Date(productionEndTime);
        if (startTime && new Date(startTime) < productionEnd) {
          alert("Quality start time cannot be before production end time.");
          return;
        }
        if (endTime && new Date(endTime) < productionEnd) {
          alert("Quality end time cannot be before production end time.");
          return;
        }
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    // Handle other changes
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission for adding or updating QC data
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation for productionEndTime
    const {
      planId,
      batchId,
      producedUnits,
      qcPassedUnits,
      qcFailedUnits,
      qualityStartTime,
      qualityEndTime,
    } = formData;
    if (!qualityStartTime || !qualityEndTime) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate that the start time is before the end time
    if (new Date(qualityStartTime) > new Date(qualityEndTime)) {
      toast.error("Start time must be before end time.");
      return;
    }

    // Calculate final loss with penalty

    if (formData.endTime >= formData.startTime) {
      setErrorMessage(
        "Production End Time cannot be before Quality Start Time."
      );

      setSuccessMessage("");
      return;
    }

    const oneDayInMs = 24 * 60 * 60 * 1000;
    // if (endTime - startTime < oneDayInMs) {
    //   setErrorMessage(
    //     "Production End Time must be at least 1 day after Quality Start Time."
    //   );
    //   setSuccessMessage("");
    //   return;
    // }

    if (
      parseInt(formData.qcPassedUnits, 10) >
      parseInt(formData.producedUnits, 10)
    ) {
      setErrorMessage("QC Passed Units cannot exceed Produced Units.");
      setSuccessMessage("");
      return;
    }

    if (formData.anomalyFlag && !formData.anomalyType) {
      setErrorMessage("Please select a reason for the anomaly.");
      setSuccessMessage("");
      return;
    }

    if (formData.anomalyType === "Other" && !formData.comments.trim()) {
      setErrorMessage("Please provide details for the 'Other' reason.");
      setSuccessMessage("");
      return;
    }
    try {
      // POST request to submit QC data
      console.log(formData);

      const response = await axios.post(
        "http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/qc",
        formData
      );

      // If the request is successful
      toast.success("Quality data successfully added!");
      setErrorMessage("");

      // Reset the form data after a successful submission
      setFormData({
        planId: "",
        batchId: "",
        vehicleModel: "",
        producedUnits: "",
        qcPassedUnits: "",
        qcFailedUnits: "",
        qcFailureRate: "",
        anomalyFlag: false,
        anomalyType: "",
        shift: "Morning",
        qualityStartTime: "",
        qualityEndTime: "",
        productionEndTime: getCurrentDateTimeLocal(), // Set to current datetime when adding
      });

      setIsUpdateMode(false);
      setSelectedVehicle(null);
      setCurrentView("view");

      // Refresh vehicle list after submitting data
      try {
        const vehiclesResponse = await axios.get(
          "http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/qc/productionData"
        );
        const vehiclesData = vehiclesResponse.data;
        setVehicles(vehiclesData);
      } catch (error) {
        console.error("Error fetching production data:", error);
        setErrorMessage("Error fetching production data. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting QC data:", error);
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  // Handle updating a vehicle's QC data
  const handleUpdate = (vehicle) => {
    const productionEndTime = vehicle.productionEndTime
      ? new Date(vehicle.productionEndTime)
      : "";

    // Calculate Quality Start Time: one day + 5 hours and 30 minutes after production end time
    const qualityStartTime2 = productionEndTime
      ? new Date(productionEndTime.setDate(productionEndTime.getDate() + 1))
      : "";

    setFormData({
      planId: vehicle.planId,
      batchId: vehicle.batchId,
      vehicleModel: vehicle.vehicleModel,
      producedUnits: vehicle.actualProductionUnits,
      qcPassedUnits: vehicle.qcPassedUnits,
      qcFailedUnits: vehicle.qcFailedUnits,
      anomalyFlag: vehicle.anomalyFlag,
      anomalyType: vehicle.anomalyType,
      shift: vehicle.shift,
      qualityStartTime: qualityStartTime2.toISOString().slice(0, 16),
      qualityEndTime: vehicle.qualityEndTime
        ? new Date(vehicle.qualityEndTime).toISOString().slice(0, 16)
        : "",
      productionEndTime: vehicle.productionEndTime
        ? new Date(vehicle.productionEndTime).toISOString().slice(0, 16)
        : getCurrentDateTimeLocal(),
      amountLoss: vehicle.amountLoss,
    });
    setIsUpdateMode(true);
    setSelectedVehicle(vehicle);
    setCurrentView("add");
  };

  // Calculate failure rate, total loss, and penalty when QC data changes
  useEffect(() => {
    const {
      producedUnits,
      qcPassedUnits,
      qcFailedUnits,
      vehicleModel,
      qualityStartTime,
      qualityEndTime,
      productionEndTime,
    } = formData;

    // Ensure numeric values
    const produced = parseInt(producedUnits, 10) || 0;
    const passed = parseInt(qcPassedUnits, 10) || 0;
    const failed = parseInt(qcFailedUnits, 10) || 0;

    if (produced > 0 && passed + failed === produced) {
      // Calculate failure rate
      const failureRate = (failed / produced) * 100;
      setFormData((prev) => ({
        ...prev,
        qcFailureRate: Number(failureRate.toFixed(2)),
        amountLoss: baseLoss,
      }));

      // Calculate total loss based on production price and failed units
      const baseLoss = failed * (productionPrice[vehicleModel] || 0);
      setLoss(baseLoss);

      // Update total loss
      setTotalLoss(baseLoss);
      if (!qualityStartTime || !qualityEndTime || !productionEndTime) {
        return; // If any field is empty, do not proceed
      }
      // Check for delays in QC time
      let delayAmount = 0;
      let del = 0;
      if (qualityStartTime && qualityEndTime) {
        const start = new Date(qualityStartTime);
        const end = new Date(qualityEndTime);
        const duration = end - start; // asduration in milliseconds
        del = duration;
        // Check if QC duration exceeds 24 hours
        if (duration > 24 * 60 * 60 * 1000) {
          // Calculate delay in hours and minutes
          const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((duration / (1000 * 60)) % 60);
          delayAmount = `QC duration exceeded 24 hours by ${hours} hour(s) and ${minutes} minute(s).`;
        } else {
          delayAmount = ""; // No delay
        }
      }

      setFormData((prev) => ({
        ...prev,
        delay: Math.floor(del / (1000 * 60)) - 1440,
      }));
    } else {
      // Reset values if input data is not consistent
      setLoss(0);
      setTotalLoss(0);
      setFormData((prev) => ({
        ...prev,
        qcFailureRate: "0.00",
        anomalyFlag: false,
        delay: 0,
      }));
    }
  }, [
    formData.producedUnits,
    formData.qcPassedUnits,
    formData.qcFailedUnits,
    formData.qualityStartTime,
    formData.qualityEndTime,
    formData.vehicleModel,
  ]);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">TVS Motors</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => setCurrentView("view")}
            className={`flex items-center p-3 rounded-md transition-colors ${
              currentView === "view"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            <FaEye className="mr-2" />
            View Vehicles
          </button>
          <button
            onClick={() => {
              setFormData({
                planId: "",
                batchId: "",
                vehicleModel: "",
                producedUnits: "",
                qcPassedUnits: "",
                qcFailedUnits: "",
                anomalyFlag: false,
                anomalyType: "",

                shift: "Shift-1",
                qualityStartTime: "",
                qualityEndTime: "",
                productionEndTime: getCurrentDateTimeLocal(), // Set to current datetime when adding
              });
              setIsUpdateMode(false);
              setSelectedVehicle(null);
              setCurrentView("add");
            }}
            className={`flex items-center p-3 rounded-md transition-colors ${
              currentView === "add"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            <FaPlus className="mr-2" />
            Add Quality Data
          </button>

          <button
            onClick={() => setCurrentView("Graphs")}
            className={`flex items-center p-3 rounded-md transition-colors ${
              currentView === "Graphs"
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
      <div className="flex-1 p-10 bg-gray-100 overflow-auto w-full">
        {/* Conditional Rendering Based on Current View */}
        <Header
          title="Welcome Quality Controller"
          subText="Lets Select Best Of The Best"
        />
        {currentView === "view" && (
          <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
              Vehicle List
            </h1>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                {errorMessage}
              </div>
            )}

            {/* Vehicle List Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead>
                  <tr>
                    <th className="p-4 border-b text-left">Batch ID</th>
                    <th className="p-4 border-b text-left">Vehicle Model</th>
                    <th className="p-4 border-b text-left">Produced Units</th>
                    <th className="p-4 border-b text-left">
                      Production End Date
                    </th>
                    <th className="p-4 border-b text-left">
                      Production End Time
                    </th>
                    <th className="p-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                      <tr key={vehicle.batchId} className="hover:bg-gray-100">
                        <td className="p-4 border-b">{vehicle.batchId}</td>
                        <td className="p-4 border-b">{vehicle.vehicleModel}</td>
                        <td className="p-4 border-b">
                          {vehicle.actualProductionUnits}
                        </td>
                        <td className="p-4 border-b">
                          {vehicle.productionEndTime
                            ? new Date(
                                vehicle.productionEndTime
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-4 border-b">
                          {vehicle.productionEndTime
                            ? new Date(
                                vehicle.productionEndTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </td>
                        <td className="p-4 border-b flex space-x-3">
                          <button
                            onClick={() => handleUpdate(vehicle)}
                            className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                            title="Update"
                          >
                            <FaEdit className="mr-1" />
                            Update
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-600">
                        No vehicles available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
        {currentView == "add" && (
          <>
            <div className=" justify-between  mb-8 flex-1 p-6  overflow-auto">
              <h1 className="text-3xl font-bold text-gray-800">
                {isUpdateMode ? "Update QC Data" : "Add Quality  Data"}
              </h1>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                {errorMessage}
              </div>
            )}

            {/* QC Data Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-md overflow-auto "
            >
              <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                {/* Plan ID */}
                <InputField
                  label="Plan ID"
                  name="planId"
                  value={formData.planId}
                  onChange={handleChange}
                  readOnly
                  disabled
                />

                {/* Batch ID */}
                <InputField
                  label="Batch ID"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  disabled // Prevent editing Batch ID during update
                  readOnly
                />

                {/* Vehicle Model */}
                <InputField
                  label="Vehicle Model"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  readOnly
                  disabled
                />

                {/* Produced Units */}
                <InputField
                  label="Produced Units"
                  name="producedUnits"
                  type="number"
                  value={formData.producedUnits}
                  onChange={handleChange}
                  readOnly
                  disabled
                />
                <InputField
                  label="QC Passed Units"
                  name="qcPassedUnits"
                  type="number"
                  value={formData.qcPassedUnits}
                  onChange={handleChange}
                  required
                >
                  <span style={{ color: "red" }}>*</span>
                </InputField>

                {/* QC Failed Units */}
                <InputField
                  label="QC Failed Units"
                  name="qcFailedUnits"
                  type="number"
                  value={formData.qcFailedUnits}
                  onChange={handleChange}
                  readOnly
                  disabled
                />

                <div>
                  <label
                    htmlFor="qcFailureRate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    QC Failure Rate (%)
                  </label>
                  <input
                    type="text"
                    id="qcFailureRate"
                    name="qcFailureRate"
                    value={formData.qcFailureRate}
                    readOnly
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                {/* Shift */}
                <div>
                  <label
                    htmlFor="shift"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Shift
                  </label>
                  <input
                    id="shift"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    readOnly
                  ></input>
                </div>

                {/* Quality Start Time */}
                <div>
                  <label
                    htmlFor="qualityStartTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quality Start Time
                  </label>
                  <input
                    type="datetime-local"
                    id="qualityStartTime"
                    name="qualityStartTime"
                    value={formData.qualityStartTime}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    readOnly
                  />
                </div>

                {/* Quality End Time */}
                <div>
                  <label
                    htmlFor="qualityEndTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quality End Time <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="qualityEndTime"
                    name="qualityEndTime"
                    value={formData.qualityEndTime}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={formData.qualityStartTime}
                  />
                </div>

                {/* Production End Time */}
                <div>
                  <label
                    htmlFor="productionEndTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Production End Time
                  </label>
                  <input
                    type="datetime-local"
                    id="productionEndTime"
                    name="productionEndTime"
                    value={formData.productionEndTime}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    readOnly
                    disabled
                  />
                </div>

                {/* Anomaly Flag */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="anomalyFlag"
                    name="anomalyFlag"
                    checked={formData.anomalyFlag}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="anomalyFlag"
                    className="text-sm font-medium text-gray-700"
                  >
                    Anomaly Flag
                  </label>
                </div>

                {/* Anomaly Reason */}
                <div>
                  <label
                    htmlFor="anomalyType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Anomaly Reason
                  </label>
                  <select
                    id="anomalyType"
                    name="anomalyType"
                    value={formData.anomalyType}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.anomalyFlag}
                    required={formData.anomalyFlag}
                  >
                    <option value="">Select Reason</option>
                    {ANOMALY_REASONS.map((reason, index) => (
                      <option key={index} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comment Text Box for 'Other' Anomaly Reason */}
                {
                  <div className="md:col-span-2">
                    <label
                      htmlFor="comments"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Please specify the reason
                    </label>
                    <textarea
                      id="comments"
                      name="comments"
                      rows="3"
                      value={formData.comments}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={formData.anomalyType === "Other"}
                      readOnly={formData.anomalyType === "Other" ? "" : true} // Adjust readOnly condition as needed
                      disabled={formData.anomalyType === "Other" ? "" : true} // Adjust readOnly condition as needed
                    />
                  </div>
                }
              </div>
              {amountLoss > 0 && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <label
                    className={`font-semibold ${
                      amountLoss > 0 ? "text-red-600" : "text-green-600"
                    }`}
                    value={formData.amountLoss}
                    onChange={handleChange}
                  >
                    Total Loss: ₹{amountLoss.toFixed(2)}
                  </label>
                </div>
              )}
              {formData.delay > 0 && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <label className={`font-semibold ${"text-red-600"}`}>
                    Time Delay : {formData.delay} minutes
                  </label>
                </div>
              )}
              {/* Submit Button */}
              {errorMessage == "" ? (
                <button
                  type="submit"
                  className="mt-6 flex items-center justify-center w-full bg-green-400 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <FaSave className="mr-2" />
                  Update QC Data"
                </button>
              ) : (
                <>
                  <button
                    disabled
                    className=" disabled mt-6 flex items-center justify-center w-full bg-red-400 text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Invalid input : {errorMessage}
                  </button>
                </>
              )}
            </form>
          </>
        )}

        {currentView == "Graphs" && (
          <>
            <iframe
              src="http://localhost:3000/public/dashboard/ff28e3ac-4836-47fc-ae19-55c0dec9b7c9#refresh=5"
              frameborder="0"
              width="1100"
              height="1600"
              allowFullScreen
              allowtransparency
            ></iframe>
          </>
        )}
      </div>

      {/* {currentView=="Graphs" && (
<>
<iframe
    src="http://localhost:3000/public/dashboard/ff28e3ac-4836-47fc-ae19-55c0dec9b7c9"
    frameborder="0"
    width="800"
    height="600"
    allowtransparency
></iframe>
</>
      )} */}
    </div>
  );
};

// InputField component for text and number inputs
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} <span style={{ color: "red" }}>*</span>
    </label>

    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 block w-full p-2 border ${
        disabled ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
      required={!disabled}
    />
  </div>
);

// TextAreaField component for text areas
const TextAreaField = ({ label, name, value, onChange }) => (
  <div className="md:col-span-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      rows="3"
      value={value}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      required
    />
  </div>
);

export default QualityControlPage;
