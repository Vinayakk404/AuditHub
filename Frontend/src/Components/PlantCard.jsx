// src/components/PlantCard.js
import React from 'react';

const PlantCard = ({ plant }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">{plant.plantName}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plant.shifts.map((shift, index) => (
          <div key={index} className="bg-blue-100 p-4 rounded">
            <h4 className="font-medium">{shift.shiftName}</h4>
            <p>Units: {shift.units}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="font-medium">Vehicles:</p>
        <ul className="list-disc list-inside">
          {plant.vehicles.map((vehicle, index) => (
            <li key={index}>{vehicle}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlantCard;
