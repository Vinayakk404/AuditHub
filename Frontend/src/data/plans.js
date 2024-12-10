import axios from '../utils/axoisConfig';

export const plans = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/productionData/plans");
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

