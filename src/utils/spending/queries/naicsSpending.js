import { spendingApi } from '../../api/spendingApi';
import { SPENDING_ENDPOINTS } from '../../api/spendingEndpoints';
import { getBaseFilters, AWARD_FIELDS } from '../queryParams';

export async function getNaicsSpending(naicsCodes) {
  const params = {
    filters: getBaseFilters(naicsCodes),
    fields: AWARD_FIELDS,
    page: 1,
    limit: 100,
    sort: "Award Amount",
    order: "desc",
    subawards: false
  };

  try {
    const response = await spendingApi.post(
      SPENDING_ENDPOINTS.SPENDING_BY_AWARD,
      params
    );
    return response.data;
  } catch (error) {
    console.error('NAICS spending query failed:', error);
    throw error;
  }
}