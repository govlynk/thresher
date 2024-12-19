import axios from "axios";

export const spendingApi = axios.create({
  baseURL: "https://api.usaspending.gov/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

export const logApiResponse = (endpoint, response) => {
  console.log(`[USASpending API] ${endpoint} Response:`, {
    status: response.status,
    data: response.data,
  });
};

export const logApiError = (endpoint, error) => {
  console.error(`[USASpending API] ${endpoint} Error:`, {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  });
};