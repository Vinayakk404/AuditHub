// src/components/Sidebar.jsx
import React from "react";

const Sidebar = ({ plans, selectedPlanId, onSelectPlan }) => {
  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 bg-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold  text-gray-800 mb-16 text-center">Production Plans</h1>
        <ul>
          {console.log(plans)}
          {plans.map((plan) => (
            <li  className="mb-2">
              <button
                onClick={() => onSelectPlan(plan.planId)}
                aria-current={selectedPlanId === plan.planId ? "page" : undefined}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-between ${
                  selectedPlanId === plan.planId
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
              >
                <span>Plan {plan.planId}</span>
                <span className="text-md">Budget: &#8377;{ plan.budget}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
