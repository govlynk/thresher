import { spendingApi } from '../../api/spendingApi';
import { SPENDING_ENDPOINTS } from '../../api/spendingEndpoints';
import { getBaseFilters } from '../queryParams';

export async function getAgencySpending(naicsCodes) {
  const params = {
    filters: getBaseFilters(naicsCodes),
    category: "awarding_agency",
    limit: 10,
    page: 1
  };

  try {
    const response = await spendingApi.post(
      SPENDING_ENDPOINTS.SPENDING_BY_CATEGORY,
      params
    );
    return response.data;
  } catch (error) {
    console.error('Agency spending query failed:', error);
    throw error;
  }
}