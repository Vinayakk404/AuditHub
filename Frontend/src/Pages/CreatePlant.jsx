// src/pages/CreatePlant.js
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ShiftCard from "../Components/ShiftCard";
import FeedbackModal from "../Components/FeedbackModal";

const CreatePlant = () => {
  const [plantName, setPlantName] = useState("");
  const [shifts, setShifts] = useState([
    { shiftName: "Shift A", units: 1333 },
    { shiftName: "Shift B", units: 1333 },
    { shiftName: "Shift C", units: 1334 }, // Adjusted to total 4000
  ]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plantName.trim()) {
      setFeedbackMessage("Plant name cannot be empty.");
      setShowModal(true);
      return;
    }

    const newPlant = {
      plantId: uuidv4(),
      plantName,
      shifts,
      vehicles,
    };

    // In a real application, send `newPlant` to the backend or global state
    console.log("New Plan Created:", newPlant);

    setFeedbackMessage("Plan created successfully!");
    setShowModal(true);
    // Reset form
    setPlantName("");
    setShifts([
      { shiftName: "Shift A", units: 1333 },
      { shiftName: "Shift B", units: 1333 },
      { shiftName: "Shift C", units: 1334 },
    ]);
    setVehicles([]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Plant</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plant Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plant Name
          </label>
          <input
            type="text"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Enter Plant Name"
            required
          />
        </div>

        {/* Shifts Allocation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shifts
          </label>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {shifts.map((shift, index) => (
              <ShiftCard
                key={index}
                shiftName={shift.shiftName}
                units={shift.units}
                onUnitsChange={(newUnits) => {
                  const updatedShifts = [...shifts];
                  updatedShifts[index].units = newUnits;
                  setShifts(updatedShifts);
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Total Units:{" "}
            {shifts.reduce((acc, curr) => acc + Number(curr.units), 0)}
          </p>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Vehicles
          </label>
          <select
            multiple
            value={vehicles}
            onChange={(e) =>
              setVehicles(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            required
          >
            {/* Predefined list of vehicles */}
            <option value="Apache RTR 160">Apache RTR 160</option>
            <option value="Ntorq">Ntorq</option>
            <option value="Apache RTR 200">Apache RTR 200</option>
            <option value="Jupiter">Jupiter</option>
            <option value="Pulsar">Pulsar</option>
            <option value="HT Roadster">HT Roadster</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Hold down the Ctrl (windows) or Command (Mac) button to select
            multiple options.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Plant
        </button>
      </form>

      {/* Feedback Modal */}
      {showModal && (
        <FeedbackModal
          message={feedbackMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CreatePlant;
