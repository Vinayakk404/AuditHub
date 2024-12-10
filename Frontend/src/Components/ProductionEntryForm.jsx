// src/components/ProductionEntryForm.jsx

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchProductionData, updateProductionData } from '../services/api';
import { toast } from 'react-toastify';
import { VEHICLE_MODELS } from '../constants/vehicleModels';
import { useParams } from 'react-router-dom';


const ProductionEntryForm = ({ planId, productionPlans }) => {
  const [showForm, setShowForm] = useState(true);
const params=useParams();

const todayDate = () => {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istNow = new Date(now.getTime() + offset);

  // Format current IST date as YYYY-MM-DD
  const todayIST = istNow.toISOString().slice(0, 10);
 
};

  const [actualUnits, setActualUnits] = useState(
    productionPlans.reduce((acc, plan) => {
      acc[plan.shift] = acc[plan.shift] || {};
      acc[plan.shift][plan.vehicleModel] = 0;
      return acc;
    }, {})
  );

  const [anomalies, setAnomalies] = useState({});

  const [totalLoss, setTotalLoss] = useState(0);

  // Calculate loss whenever actualUnits or anomalies change
  useEffect(() => {
    let loss = 0;
    productionPlans.forEach(plan => {
      const actual = Number(actualUnits[plan.shift][plan.vehicleModel]);
      const rate = calculateProductionRate(plan.plannedProductionUnits, actual);
      if (rate < 70) {
        const difference = plan.plannedProductionUnits - actual;
        const vehicle = VEHICLE_MODELS.find(v => v.label === plan.vehicleModel);
        if (vehicle) {
          loss += difference * (vehicle.productionPrice/2);
        }
      }
    });
    setTotalLoss(loss);
  }, [actualUnits, anomalies, productionPlans]);

  const handleInputChange = (shift, model, value) => {
    if (value < 0 ) {
      toast.error("Actual units cannot be negative.");
      return;
    }

    
    setActualUnits(prev => ({
      ...prev,
      [shift]: {
        ...prev[shift],
        [model]: value,
      },
    }));
  };

  const handleAnomalyChange = (shift, model, value) => {
    setAnomalies(prev => ({
      ...prev,
      [`${shift}-${model}`]: value,
    }));
  };

  const calculateProductionRate = (planned, actual) => {
    if (planned === 0) return 0;
    return (actual / planned) * 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    for (let plan of productionPlans) {
      const actual = Number(actualUnits[plan.shift][plan.vehicleModel]);
      if (isNaN(actual) || actual < 0 || actual>plan.plannedProductionUnits) {
        toast.error(`Please enter a valid number for ${plan.vehicleModel} - ${plan.shift}.`);
        return;
      }
      const rate = calculateProductionRate(plan.plannedProductionUnits, actual);
      if (rate < 70 && !anomalies[`${plan.shift}-${plan.vehicleModel}`]) {
        toast.error(`Please select an anomaly type for ${plan.vehicleModel} - ${plan.shift}.`);
        return;
      }
    }

    // Prepare data for submission
    const submissions = productionPlans.map((plan,index) => {
      const actual = Number(actualUnits[plan.shift][plan.vehicleModel]);
      const rate = calculateProductionRate(plan.plannedProductionUnits, actual);
      const anomaly = rate < 70 ? anomalies[`${plan.shift}-${plan.vehicleModel}`] : null;
      const vehicle = VEHICLE_MODELS.find(v => v.label === plan.vehicleModel);
      return {
        planId,
        batchId: plan.batchId, // Updated to use batchId
        actualProductionUnits: actual,
        productionRate: rate,
        anomalyType: anomalies[`${plan.shift}-${plan.vehicleModel}`] || '',
        amountLoss: rate<70?((plan.plannedProductionUnits - Number(actualUnits[plan.shift][plan.vehicleModel])) * vehicle.productionPrice/2):0,  
        status: 'Completed'
       
      };
    });

    try {
     
      
      await updateProductionData(submissions);
      toast.success('Production data updated successfully!');
     
      setShowForm(true);
      // Reset form 
      
      setActualUnits(
        productionPlans.reduce((acc, plan) => {
          acc[plan.shift] = acc[plan.shift] || {};
          acc[plan.shift][plan.vehicleModel] = '';
          return acc;
        }, {})
      );
      setAnomalies({});
      setTotalLoss(0);
    
    } catch (error) {
      console.error('Error updating production data:', error);
      toast.error('Failed to update production data.');
    }
  };

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {!showForm ? 'Cancel Update' : 'Update Production Data'}
      </button>

      {!showForm && (
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-6">Enter Actual Production Units for Today</h3>
          <div className="space-y-6">
            {productionPlans.map(plan => {
              const rate = calculateProductionRate(plan.plannedProductionUnits, Number(actualUnits[plan.shift][plan.vehicleModel]));
              const showAnomaly = rate < 70;
              const vehicle = VEHICLE_MODELS.find(v => v.label === plan.vehicleModel);

              return (
                <div key={plan.batchId} className="border p-4 rounded-lg">
                  <h4 className="text-xl font-medium mb-4">{plan.vehicleModel} - {plan.shift}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Planned Units */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Planned Units:
                      </label>
                      <p className="mt-1 text-gray-900">{plan.plannedProductionUnits}</p>
                    </div>

                    {/* Actual Units */}
                    <div>
                      <label htmlFor={`actual-${plan.batchId}`} className="block text-sm font-medium text-gray-700">
                        Actual Units:
                      </label>
                      <input
                        type="number"
                        id={`actual-${plan.batchId}`}
                        value={actualUnits[plan.shift][plan.vehicleModel]}
                        onChange={(e) => handleInputChange(plan.shift, plan.vehicleModel, e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        max={plan.plannedProductionUnits}
                      />
                    </div>

                    {/* Production Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Production Rate:
                      </label>
                      <p className={`mt-1 font-semibold ${rate < 70 ? 'text-red-600' : 'text-green-600'}`}>
                        {rate ? `${rate.toFixed(2)}%` : '-'}
                      </p>
                    </div>

                    {/* Loss Calculation */}
                    {rate < 70 && vehicle && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loss of Money:
                        </label>
                        <p className="mt-1 text-red-600 font-semibold">
                          ₹{((plan.plannedProductionUnits - Number(actualUnits[plan.shift][plan.vehicleModel])) * vehicle.productionPrice/2).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Anomaly Reporting */}
                  {showAnomaly && (
                    <div className="mt-6">
                      <label htmlFor={`anomaly-${plan.batchId}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Anomaly Type:
                      </label>
                      <select
                        id={`anomaly-${plan.batchId}`}
                        onChange={(e) => handleAnomalyChange(plan.shift, plan.vehicleModel, e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Anomaly</option>
                        <option value="Mechanical Failure">Mechanical Failure</option>
                        <option value="Electrical Failure">Electrical Failure</option>
                        <option value="Supply Chain Issues">Supply Chain Issues</option>
                        <option value="Labor Shortage">Labor Shortage</option>
                        <option value="Material Shortage">Material Shortage</option>
                        {/* Add more anomaly types as needed */}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total Loss Display */}
          {totalLoss > 0 && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold">Total Loss Due to Low Production Rates: ₹{totalLoss.toLocaleString()}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
              totalLoss > 0 ? '' : ''
            }`}
          >
            Submit Production Data
          </button>
        </form>
      )}
    </div>
  );
};

ProductionEntryForm.propTypes = {
  planId: PropTypes.string.isRequired,
  productionPlans: PropTypes.arrayOf(
    PropTypes.shape({
      batchId: PropTypes.number.isRequired, // Updated to batchId
      vehicleModel: PropTypes.string.isRequired,
      shift: PropTypes.string.isRequired,
      plannedProductionUnits: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ProductionEntryForm;
