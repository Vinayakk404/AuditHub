import React, { useState, useEffect } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify'; // Importing toast
import 'react-toastify/dist/ReactToastify.css'; // Importing toast CSS
import { FaTrash,FaPlus } from 'react-icons/fa';
import axios from "../utils/axoisConfig"
const VEHICLE_ID_MAPPING = {
  "Apache RTR 160": "V101",
  "TVS Ntorq": "V102",
  "Tvs Jupiter": "V103",
  "Star City": "V104",
};

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios('http://localhost:8080/api/inventory/qc');

      const data = response.data;
      console.log(data)
      setVehicles(data);
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const appendVehicle = async (vehicle) => {
    const vehicleId = VEHICLE_ID_MAPPING[vehicle.vehicleModel] || "Unknown";

    const vehicleData = {
      batchId: vehicle.batchId,
      vehicleModel:vehicle.vehicleModel,
      vehicleId,
      stock: vehicle.qcPassedUnits

    };

    try {
      const response = await axios.post('http://localhost:8080/api/inventory/inv', 
     vehicleData);

      
      toast.success('Vehicle added successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      fetchVehicles(); // Refresh the vehicle list after appending
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const removeVehicle = async (id) => {
    try {
      const response = await axios(`http://localhost:8080/api/inventory/batch/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove vehicle');

      fetchVehicles(); // Refresh the vehicle list after deletion
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="p-4">
      <ToastContainer /> {/* Toast Container for notifications */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 border-b">Batch ID</th>
            <th className="py-2 border-b">Model Name</th>
            <th className="py-2 border-b">Stock</th>
            <th className="py-2 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody className=' text-center'>
          {vehicles.map((vehicle, index) => (
            <tr key={vehicle.vehicleId} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="py-2 border-b px-4">{vehicle.batchId}</td>
              <td className="py-2 border-b px-4">{vehicle.vehicleModel == null ? 0 : vehicle.vehicleModel}</td>
              <td className="py-2 border-b px-4">{vehicle.qcPassedUnits}</td>
              <td className="py-2 border-b px-4 flex justify-center space-x-4 items-center">
                <button
                  onClick={() => appendVehicle(vehicle)}
                  className=" h-10 flex items-center p-3  bg-green-500 text-white  hover:bg-green-600 transition duration-200  rounded-md"
                >
                  <FaPlus className='mr-2'/> Add 
                </button>

                {/* <button
                  onClick={() => removeVehicle(vehicle.vehicleId)}
                  className="bg-red-500 text-white p-2 hover:bg-red-600 transition duration-200 rounded-full"
                >
                  <FaTrash />df
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
