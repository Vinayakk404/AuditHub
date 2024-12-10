// src/components/OperatorPage.jsx
import React, { useState, useEffect } from "react";
import axios from "../utils/axoisConfig";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../Components/Header";
const OperatorPage = () => {
  const { operatorId } = useParams(); // Get operatorId from URL
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [updateData, setUpdateData] = useState({
    productionStartTime: "",
    productionEndTime: "",
    anomalyFlag: false,
    anomalyType: "",
    anomalyComments: "",
    actualProducedUnits: "",
    status: "On Hold",
  });
  const [planIds, setPlanIds] = useState([1, 2, 3, 4]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/productionData/operator/${operatorId}`
      );
      setBatches(response.data);
      console.log(response.data);
      // Extract unique Plan IDs for the sidebar
      const uniquePlanIds = [
        ...new Set(response.data.map((batch) => batch.planId)),
      ];
      setPlanIds(uniquePlanIds);
    } catch (error) {
      toast.error("Error Fetching data", error);

      console.error(error);
    }
  };
  useEffect(() => {
    // Fetch batches assigned to the operator

    fetchBatches();
  }, [operatorId]);

  const handleSelectBatch = (batch) => {
    setSelectedBatch(batch);
    setUpdateData({
      productionStartTime: batch.productionStartTime
        ? new Date(batch.productionStartTime).toLocaleString()
        : "",
      productionEndTime: batch.productionEndTime
        ? batch.productionEndTime.slice(0, 16) // Format for datetime-local
        : "",
      anomalyFlag: batch.anomalyFlag || false,
      anomalyType: batch.anomalyType || "",
      anomalyComments: batch.anomalyComments || "",
      actualProductionUnits: batch.actualProducedUnits || "",
      status: batch.status || "On Hold",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Reset anomalyComments if anomalyType is not 'Other'
      ...(name === "anomalyType" &&
        value !== "Other" && { anomalyComments: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBatch) {
      return;
    }

    // Prepare the payload
    const payload = {
      productionEndTime: updateData.productionEndTime
        ? new Date(updateData.productionEndTime).toISOString()
        : null,
      anomalyFlag: updateData.anomalyFlag,
      anomalyType: updateData.anomalyType,
      anomalyComments:
        updateData.anomalyType === "Other" ? updateData.anomalyComments : "",
      actualProductionUnits: Number(updateData.actualProducedUnits),
      status: updateData.status,
    };

    try {
      await axios.put(
        `http://localhost:8080/api/productionData/${selectedBatch.batchId}`,
        payload
      );
      console.log(payload);
      // Update the local state
      setBatches((prevBatches) =>
        prevBatches.map((batch) =>
          batch.batchId === selectedBatch.batchId
            ? { ...batch, ...payload }
            : batch
        )
      );

      setSelectedBatch(null); // Reset selection
      toast.success("Data Edited Succesfully");
      fetchBatches();
    } catch (error) {
      toast.error(error);
      // Optionally, handle error by showing a message to the user
    }
  };

  // Filter batches based on selectedPlanId
  const filteredBatches =
    selectedPlanId !== null
      ? batches.filter((batch) => batch.planId === selectedPlanId)
      : batches;

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-64  text-black p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Production IDs</h2>
        <ul>
          {planIds.map((planId) => (
            <li key={planId} className="mb-2">
              <button
                onClick={() =>
                  setSelectedPlanId(selectedPlanId === planId ? null : planId)
                }
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedPlanId === planId
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
              >
                <span className="font-medium">Plan ID : {planId} </span>{" "}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto w-3/4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Header />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Operator Dashboard
          </h2>

          {/* Batches Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Batch ID</th>
                  <th className="py-2 px-4 border">Plan ID</th>
                  <th className="py-2 px-4 border">Vehicle Model</th>
                  <th className="py-2 px-4 border">Production Line</th>
                  <th className="py-2 px-4 border">Shift</th>
                  <th className="py-2 px-4 border">Planned Units</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => (
                  <tr key={batch.batchId} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">{batch.batchId}</td>
                    <td className="py-2 px-4 border">{batch.planId}</td>
                    <td className="py-2 px-4 border">{batch.vehicleModel}</td>
                    <td className="py-2 px-4 border">{batch.productionLine}</td>
                    <td className="py-2 px-4 border">{batch.shift}</td>
                    <td className="py-2 px-4 border">
                      {batch.plannedProductionUnits}
                    </td>
                    <td className="py-2 px-4 border">{batch.status}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleSelectBatch(batch)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBatches.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-4 px-4 border text-center text-gray-500"
                    >
                      No batches found for the selected Plan ID.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Batch Form */}
          {selectedBatch && (
            <div className="mt-8 pb-9">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Edit Batch {selectedBatch.batchId}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Uneditable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">
                      Production Start Time:
                    </label>
                    <input
                      type="text"
                      value={updateData.productionStartTime}
                      readOnly
                      className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">
                      Vehicle Model:
                    </label>
                    <input
                      type="text"
                      value={selectedBatch.vehicleModel}
                      readOnly
                      className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">
                      Production Line:
                    </label>
                    <input
                      type="text"
                      value={selectedBatch.productionLine}
                      readOnly
                      className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Shift:</label>
                    <input
                      type="text"
                      value={selectedBatch.shift}
                      readOnly
                      className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">
                      Planned Production Units:
                    </label>
                    <input
                      type="number"
                      value={selectedBatch.plannedProductionUnits}
                      readOnly
                      className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100"
                    />
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">
                      Production End Time:
                    </label>
                    <input
                      type="datetime-local" // Fixed typo here
                      name="productionEndTime"
                      value={updateData.productionEndTime}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="anomalyFlag"
                      checked={updateData.anomalyFlag}
                      onChange={handleChange}
                      className="mt-4 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-gray-700">
                      Anomaly Flag
                    </label>
                  </div>

                  <div>
                    <label className="block text-gray-700">Anomaly Type:</label>
                    <select
                      name="anomalyType"
                      value={updateData.anomalyType}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!updateData.anomalyFlag}
                      required={updateData.anomalyFlag}
                    >
                      <option value="">Select Anomaly Type</option>
                      <option value="Mechanical Failure">
                        Mechanical Failure
                      </option>
                      <option value="Electrical Issue">Electrical Issue</option>
                      <option value="Quality Control">Quality Control</option>
                      <option value="Supply Shortage">Supply Shortage</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {updateData.anomalyType === "Other" && (
                    <div className="md:col-span-2">
                      <label className="block text-gray-700">
                        Anomaly Comments:
                      </label>
                      <textarea
                        name="anomalyComments"
                        value={updateData.anomalyComments}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter additional comments..."
                        required={updateData.anomalyType === "Other"}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700">
                      Actual Produced Units:
                    </label>
                    <input
                      type="number"
                      name="actualProducedUnits"
                      value={updateData.actualProducedUnits}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Status:</label>
                    <select
                      name="status"
                      value={updateData.status}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setSelectedBatch(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Update Batch
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorPage;
