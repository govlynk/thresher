import { spendingApi } from '../../api/spendingApi';
import { SPENDING_ENDPOINTS } from '../../api/spendingEndpoints';
import { getBaseFilters } from '../queryParams';

export async function getGeographicSpending(naicsCodes) {
  const params = {
    filters: getBaseFilters(naicsCodes),
    scope: "place_of_performance",
    geo_layer: "state",
    page: 1,
    limit: 100
  };

  try {
    const response = await spendingApi.post(
      SPENDING_ENDPOINTS.SPENDING_BY_GEOGRAPHY,
      params
    );
    return response.data;
  } catch (error) {
    console.error('Geographic spending query failed:', error);
    throw error;
  }
}