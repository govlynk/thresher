import { generateClient } from 'aws-amplify/api';

const client = generateClient();

// Error handling wrapper
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 429:
        throw new Error('Rate limit exceeded. Please try again later.');
      case 403:
        throw new Error('Access denied. Please check your authentication.');
      case 401:
        throw new Error('Unauthorized. Please sign in again.');
      default:
        throw new Error(error.response.data?.error || 'An error occurred while fetching opportunities.');
    }
  }
  throw new Error('Network error occurred. Please check your connection.');
};

// Format query parameters
const formatQueryParams = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value != null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
};

// Get opportunities with pagination
export const getOpportunities = async (params = {}) => {
  try {
    const queryString = formatQueryParams(params);
    const path = `/opportunities${queryString ? `?${queryString}` : ''}`;

    const response = await client.get({
      apiName: 'OpportunityApi',
      path,
      options: {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Search opportunities with advanced criteria
export const searchOpportunities = async (searchCriteria) => {
  try {
    const response = await client.post({
      apiName: 'OpportunityApi',
      path: '/opportunities/search',
      options: {
        headers: {
          'Content-Type': 'application/json'
        },
        body: searchCriteria
      }
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Retry mechanism for failed requests
export const retryRequest = async (requestFn, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (error.response?.status !== 429) {
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  
  throw lastError;
};