// src/components/CurrentPlans.jsx

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CurrentPlans = ({ plans }) => {
  const [filterShift, setFilterShift] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Filtered plans based on user selection
  const filteredPlans = plans.filter((plan) => {
    let isValid = true;
    if (filterShift && plan.shift !== filterShift) isValid = false;
    if (filterStatus && plan.status !== filterStatus) isValid = false;
    return isValid;
  });

  // Prepare data for Recharts
  const chartData = [
    {
      shift: "Shift-1",
      Planned: plans
        .filter((plan) => plan.shift === "Shift 1")
        .reduce((sum, plan) => sum + plan.plannedProductionUnits, 0),
      Actual: plans
        .filter((plan) => plan.shift === "Shift 1")
        .reduce((sum, plan) => sum + (plan.actualProductionUnits || 0), 0),
    },
    {
      shift: "Shift-2",
      Planned: plans
        .filter((plan) => plan.shift === "Shift 2")
        .reduce((sum, plan) => sum + plan.plannedProductionUnits, 0),
      Actual: plans
        .filter((plan) => plan.shift === "Shift 2")
        .reduce((sum, plan) => sum + (plan.actualProductionUnits || 0), 0),
    },
    {
      shift: "Shift-3",
      Planned: plans
        .filter((plan) => plan.shift === "Shift 3")
        .reduce((sum, plan) => sum + plan.plannedProductionUnits, 0),
      Actual: plans
        .filter((plan) => plan.shift === "Shift 3")
        .reduce((sum, plan) => sum + (plan.actualProductionUnits || 0), 0),
    },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        {/* Filter by Shift */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filter by Shift
          </label>
          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          >
            <option value="">All Shifts</option>
            <option value="Shift 1">Shift 1</option>
            <option value="Shift 2">Shift 2</option>
            <option value="Shift 3">Shift 3</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Production Distribution Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Planned vs Actual Production by Shift
        </h3>
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
      </div>

      {/* Plans Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Plan ID</th>
              <th className="py-2 px-4 border">Budget</th>
              <th className="py-2 px-4 border">Start Date</th>
              <th className="py-2 px-4 border">End Date</th>
              <th className="py-2 px-4 border">Planned Units</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <tr
                  key={`${plan.planId}-${plan.vehicleId}-${plan.shift}-${plan.date}`}
                >
                  <td className="py-2 px-4 border">{plan.planId}</td>
                  {console.log(plan)}
                  <td className="py-2 px-4 border">{plan.budget}</td>
                  <td className="py-2 px-4 border">{plan.startDate}</td>
                  <td className="py-2 px-4 border">{plan.endDate}</td>
                  <td className="py-2 px-4 border">{plan.totalUnits}</td>
                  <td className="py-2 px-4 border">
                    {plan.actualProductionUnits || "-"}
                  </td>
                  <td className="py-2 px-4 border">{plan.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-2 px-4 border text-center">
                  No production plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

CurrentPlans.propTypes = {
  plans: PropTypes.array.isRequired,
};

export default CurrentPlans;
