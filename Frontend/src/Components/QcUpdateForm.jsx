// src/components/QCUpdateForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const QCUpdateForm = () => {
  const { planId } = useParams();
  const [task, setTask] = useState(null);
  const [formState, setFormState] = useState({
    qcPassedUnits: 0,
    qcFailedUnits: 0,
    qualityStartTime: "",
    qualityEndTime: "",
    anomalyFlag: false,
    anomalyReason: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/qc/productionData/${planId}`)
      .then((response) => setTask(response.data))
      .catch((error) => console.error("Error fetching task data: ", error));
  }, [planId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/qc", {
        planId,
        ...formState,
      });
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data: ", error);
      alert("Error submitting data.");
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <form className="ml-72 p-8" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">
        Update QC for Plan ID: {planId}
      </h2>
      {/* Add form fields here */}
    </form>
  );
};

export default QCUpdateForm;
