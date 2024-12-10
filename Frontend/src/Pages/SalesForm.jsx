import axios from 'axios';
import React, { useState } from 'react';
import { getInventoryByVehicleId, sellVehicle } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/'; // Adjust the backend API base URL

const SalesForm = () => {
    const [vehicleId, setVehicleId] = useState('');
    const [inventory, setInventory] = useState([]);

    
    const [totalVehicles, setTotalVehicles] = useState(0); // Total vehicles calculated from inventory
    const [saleData, setSaleData] = useState({
        salesID: `S${Date.now()}`,
        vehicleId: "",
        saleDate: new Date().toISOString().split('T')[0],
        quantitySold: "",
        salePrice: 0,
        totalSaleValue: '',
        customerID: '',
        paymentStatus: 'Completed',
        anomalyFlag: false, // Changed to boolean for consistency
        anomalyCategory: '',
        region: '',
        dealership: '',
        vehicleModel: "" // Ensure this matches the API response
    });
    const [totalPrice, setTotalPrice] = useState(0); // Total price calculated dynamically
    const [errorMessage,setErrorMessage]=useState("");
    // Handle selecting a vehicle ID
    const handleVehicleIdChange = (e) => {
        const selectedVehicleId = e.target.value;
        setVehicleId(selectedVehicleId);
 
        if (selectedVehicleId) {
            getInventoryByVehicleId(selectedVehicleId).then(response => {
                const vehicle = response.data; // API response
                console.log(vehicle); // Verify the fields
                setVehicleId(selectedVehicleId);
                // Update sale data based on the selected vehicle
                setSaleData(prevState => ({
                    ...prevState,
                    vehicleId: vehicle.vehicle_id || '', // Use correct field name
                    vehicleModel: vehicle.model || '', // Use correct field name
                    salePrice: vehicle.salePrice || 0, // Ensure salePrice is a number
                }));

                // Calculate total vehicles available
                const totalQty = response.data.reduce((total, batch) => total + batch.stock, 0);
                setTotalVehicles(totalQty);

                // Override salePrice for specific vehicle IDs if needed
                let overriddenSalePrice = vehicle.salePrice || 0;
                switch (selectedVehicleId) {
                    case "V101":
                        overriddenSalePrice = 99000;
                        break;
                    case "V102":
                        overriddenSalePrice = 297000;
                        break;
                    case "V103":
                        overriddenSalePrice = 86841;
                        break;
                    case "V104":
                        overriddenSalePrice = 80000;
                        break;
                    case "V105":
                        overriddenSalePrice = 76000;
                        break;
                    case "V106":
                        overriddenSalePrice = 70000;
                        break;
                    case "V107":
                        overriddenSalePrice = 114000;
                        break;
                    case "V108":
                        overriddenSalePrice = 999000;
                        break;

                    default:
                        break;
                }

                if (overriddenSalePrice !== (vehicle.salePrice || 0)) {
                    setSaleData(prevState => ({
                        ...prevState,
                        salePrice: overriddenSalePrice
                    }));
                }

                // Recalculate total price with the new sale price
                const updatedTotalPrice = overriddenSalePrice * saleData.quantitySold;
                setTotalPrice(updatedTotalPrice);
            }).catch(error => {
                console.error("Error fetching inventory:", error);
                toast.error('Error fetching inventory. Please try again.');
            });
        } else {
            setInventory([]);
            setTotalVehicles(0); // Reset total vehicles if no vehicle ID is selected
            setTotalPrice(0); // Reset total price
            setSaleData(prevState => ({
                ...prevState,
                vehicleId: '',
                salePrice: 0,
                vehicleModel: '',
            }));
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;


        if (name === "quantitySold") {
            if(value>totalVehicles)
            {
                toast.error(`Cannot sell ${value} vehicles. Only ${totalVehicles} available.`);
                saleData.value=0;
                return ;
            }

            const updatedQuantity = parseInt(value, 10) || 0;
            const updatedTotalPrice = updatedQuantity * (saleData.salePrice || 0);

            setSaleData(prevState => ({
                ...prevState,
                quantitySold: updatedQuantity
            }));
            setTotalPrice(updatedTotalPrice); // Update total price when quantity changes
        } else {
            setSaleData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Prevent form submission if no vehicle ID is selected
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!vehicleId) {
            toast.warn('Please select a vehicle ID before submitting.');
            return;
        }


        const quantityToSell = saleData.quantitySold;

        // Check if the requested quantity is greater than the available total quantity
        if (quantityToSell > totalVehicles) {
            toast.error(`Cannot sell ${quantityToSell} vehicles. Only ${totalVehicles} available.`);
            
            return;
        }
       

        // Prepare the sale data
        const preparedSaleData = {
            ...saleData,
            vehicleId:vehicleId,
            totalSaleValue: totalPrice
        };

     
        // Send the sale data to the backend
        sellVehicle(preparedSaleData)
            .then(() => {
                toast.success('Sale recorded successfully!');

                // Refresh the inventory after updating
                getInventoryByVehicleId(vehicleId).then(response => {
                    setInventory(response.data);
                    const totalQty = response.data.reduce((total, batch) => total + batch.stock, 0);
                    setTotalVehicles(totalQty);
                }).catch(error => {
                    console.error("Error fetching inventory after sale:", error);
                    toast.error('Error fetching updated inventory.');
                });

                resetForm();
            })
            .catch((error) => {
                console.error("Error selling vehicle", error);
                toast.error('There was an error recording the sale. Please try again.');
            });
    };

    // Function to reset the form fields
    const resetForm = () => {
        setSaleData({
            salesID: `S${Date.now()}`,
            vehicleId: '',
            saleDate: new Date().toISOString().split('T')[0],
            quantitySold: "",
            salePrice: 0,
            totalSaleValue: '',
            customerID: '',
            paymentStatus: 'Completed',
            anomalyFlag: false, // Changed to boolean for consistency
            anomalyCategory: '',
            region: '',
            dealership: '',
            vehicleModel: '' // Ensure this matches the API response
        });
        setTotalPrice(0); // Reset total price
        setVehicleId(''); // Reset selected vehicle ID
        setInventory([]); // Clear inventory
        setTotalVehicles(0); // Reset total vehicles
    };

    return (
        <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
            <ToastContainer /> {/* Toast Container for notifications */}
            <h1 className="text-2xl font-bold mb-6">Vehicle Sales</h1>

            {/* Dropdown for Vehicle IDs */}

            <div >
            <div className="mb-6" >
                <label className="block text-sm font-medium mb-2">Select Vehicle ID:</label>
                <select
                    onChange={handleVehicleIdChange}
                    value={vehicleId}
                    name="vehicleId"
                    className="border border-gray-300 rounded-md p-2 w-full"
                >
                    <option value="">--Select a Vehicle ID--</option>
                    <option value="V101">Apache RTR 160 </option>
                    <option value="V102">Apache RTR 200</option>
                    <option value="V103">TVS Ntorq</option>
                    <option value="V104">TVS Jupiter</option>
                    <option value="V105">Star City</option>
                    <option value="V106">TVS XL100</option>
                    <option value="V107">TVS iQube Electric</option>
                    <option value="V108">TVS Raider</option>
                </select>
            </div>

            {totalVehicles > 0 ? (
                <div className="mb-6 text-green-600">
                    <h2 className="text-lg font-semibold">Total Vehicles Available: {totalVehicles}</h2>
                </div>
            ):(
                <>
                 <div className="mb-6 text-red-500">
                    <h2 className="text-lg font-semibold">No Vehicles Available </h2>
                </div>
                </>
            )
        
        }

            {/* Form in Two Columns */}
            <div  className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Customer ID:</label>
                    <input
                        type="text"
                        name="customerID"
                        value={saleData.customerID}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Sale Price:</label>
                    <input
                        type="number"
                        name="salePrice"
                        value={saleData.salePrice}
                        readOnly
                        className="border border-gray-300 rounded-md p-2 w-full bg-gray-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Quantity Sold:</label>
                    <input
                        type="number"
                        name="quantitySold"
                        value={saleData.quantitySold}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Payment Status:</label>
                    <select
                        name="paymentStatus"
                        value={saleData.paymentStatus}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Dealership:</label>
                    <select
                        name="dealership"
                        value={saleData.dealership}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="">--Select Dealership--</option>
                        <option value="Dealership A">Dealership A</option>
                        <option value="Dealership B">Dealership B</option>
                        <option value="Dealership C">Dealership C</option>
                        <option value="Dealership D">Dealership D</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Region:</label>
                    <select
                        name="region"
                        value={saleData.region}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="">--Select Region--</option>
                        <option value="North">North</option>
                        <option value="West">West</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                    </select>
                </div>

                {/* Total Price Display */}
                <div>
                    <label className="block text-sm font-medium mb-2">Total Price:</label>
                    <input
                        type="number"
                        value={totalPrice}
                        readOnly
                        className="border border-gray-300 rounded-md p-2 w-full bg-gray-200"
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                    onClick={handleSubmit}
                        type="submit"
                        className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Confirm Sale
                    </button>
                </div>
            </div>
            </div>
        </div>
    );
};

export default SalesForm;
