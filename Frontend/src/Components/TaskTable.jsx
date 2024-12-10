// src/components/TaskTable.js
import React, { useState, useEffect } from "react";
import axios from "../utils/axoisConfig";
import { useHistory } from "react-router-dom";

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/qc/productionData")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const handleUpdateClick = (planId) => {
    history.push(`/update/${planId}`);
  };

  return (
    <div className="ml-72 p-8">
      <h1 className="text-2xl font-bold mb-6">Assigned Tasks</h1>
      <div className="overflow-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Plan ID</th>
              <th className="px-4 py-2">Production End Time</th>
              <th className="px-4 py-2">Batch ID</th>
              <th className="px-4 py-2">Vehicle Model</th>
              <th className="px-4 py-2">Produced Units</th>
              <th className="px-4 py-2">QC Passed Units</th>
              <th className="px-4 py-2">QC Failed Units</th>
              <th className="px-4 py-2">QC Failure Rate</th>
              <th className="px-4 py-2">Quality Start Time</th>
              <th className="px-4 py-2">Quality End Time</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{task.planId}</td>
                <td className="px-4 py-2">{task.productionEndTime}</td>
                <td className="px-4 py-2">{task.batchId}</td>
                <td className="px-4 py-2">{task.vehicleModel}</td>
                <td className="px-4 py-2">{task.producedUnits}</td>
                <td className="px-4 py-2">{task.qcPassedUnits}</td>
                <td className="px-4 py-2">{task.qcFailedUnits}</td>
                <td className="px-4 py-2">{task.qcFailureRate}%</td>
                <td className="px-4 py-2">{task.qualityStartTime}</td>
                <td className="px-4 py-2">{task.qualityEndTime}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleUpdateClick(task.planId)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
