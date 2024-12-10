import axios from '../utils/axoisConfig';

const API_URL = 'http://localhost:';

// ADD THIS
const app=axios;
var cors = require('cors');

// Fetch inventory by model
export const getInventoryByVehicleId = (vehicleId) => {
    return axios.get(`http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/sales/inventory/vehicle/${vehicleId}`);
};

// Sell a vehicle (update inventory and add to sales)
export const sellVehicle = (saleData) => {
    return axios.put(`http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/sales/sell`, saleData, {
        headers: {
            'Content-Type': 'application/json' 
        }
    });
};
export const fetchProductionData = (plantId) => {
    return axios.get(`http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/productionData/plant/${plantId}`);
  };
  
  export const updateProductionData = (data) => {
    return axios.put(`http://ec2-54-171-48-97.eu-west-1.compute.amazonaws.com:8080/api/productionData/updateProductionData`, data);
  };
  

// Update the inventory for a specific batch
// Update the inventory after selling vehicles
// export const updateInventoryAfterSale = (model, totalSale) => {
//     return axios.put(`${API_URL}8084/api/inventory/updateInventoryAfterSale`, null, {
//         params: {
//             model,
//             totalSale
//         },
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
// };
