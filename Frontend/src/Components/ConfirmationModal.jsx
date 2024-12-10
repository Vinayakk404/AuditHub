// src/components/ConfirmationModal.jsx

import React from "react";
import PropTypes from "prop-types";

const ConfirmationModal = ({ data, onClose }) => {
  console.log(data);
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-full overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">Production Plan Created</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Vehicle Model</th>
                <th className="py-2 px-4 border">Production Units</th>
                <th className="py-2 px-4 border">Plant</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Shift</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{item.vehicleModel}</td>
                  <td className="py-2 px-4 border">
                    {item.plannedProductionUnits}
                  </td>
                  <td className="py-2 px-4 border">{item.plantId}</td>
                  <td className="py-2 px-4 border">{item.date}</td>
                  <td className="py-2 px-4 border">{item.shift}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      vehicleModel: PropTypes.string.isRequired,
      productionUnits: PropTypes.number.isRequired,
      productionPrice: PropTypes.number.isRequired,
      plant: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      shift: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConfirmationModal;
