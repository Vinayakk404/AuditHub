// src/components/ProductionPlansList.jsx

import React from "react";
import PropTypes from "prop-types";

const ProductionPlansList = ({ plans }) => {
  // Group plans by planId
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.planId]) {
      acc[plan.planId] = [];
    }
    acc[plan.planId].push(plan);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Production Plans for the Selected Date
      </h2>
      {Object.keys(groupedPlans).length === 0 ? (
        <p>No production plans available for this date.</p>
      ) : (
        Object.entries(groupedPlans).map(([planId, plans]) => (
          <div key={planId} className="mb-6 p-4 border rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Plan ID: {planId}</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Vehicle Model</th>
                  <th className="py-2 px-4 border">Shift</th>
                  <th className="py-2 px-4 border">Planned Units</th>
                  <th className="py-2 px-4 border">Actual Units</th>
                  <th className="py-2 px-4 border">Anomaly</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.productionId}>
                    <td className="py-2 px-4 border">{plan.vehicleModel}</td>
                    <td className="py-2 px-4 border">{plan.shift}</td>
                    <td className="py-2 px-4 border">
                      {plan.plannedProductionUnits}
                    </td>
                    <td className="py-2 px-4 border">
                      {plan.actualProductionUnits || "-"}
                    </td>

                    <td className="py-2 px-4 border">
                      {plan.anomalyType || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

ProductionPlansList.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      planId: PropTypes.string.isRequired,
      productionId: PropTypes.string.isRequired,
      vehicleModel: PropTypes.string.isRequired,
      shift: PropTypes.string.isRequired,
      plannedProductionUnits: PropTypes.number.isRequired,
      actualProductionUnits: PropTypes.number,
      productionRate: PropTypes.number,
      anomaly: PropTypes.string,
    })
  ).isRequired,
};

export default ProductionPlansList;
