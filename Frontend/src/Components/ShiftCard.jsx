// src/components/ShiftCard.js
import React from 'react';

const ShiftCard = ({ shiftName, units, onUnitsChange }) => {
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h3 className="text-lg font-medium">{shiftName}</h3>
      <input
        type="number"
        value={units}
        onChange={(e) => onUnitsChange(Number(e.target.value))}
        className="mt-2 p-2 border border-gray-300 rounded w-full"
        min="0"
        required
      />
    </div>
  );
};

export default ShiftCard;
