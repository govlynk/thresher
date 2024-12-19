import { spendingApi, logApiResponse, logApiError } from "../api";

export async function getAgencySpending(filters) {
  try {
    const response = await spendingApi.post("/search/spending_by_category/awarding_agency", {
      filters,
      category: "awarding_agency",
      limit: 10,
      page: 1,
    });
    logApiResponse("Agency Spending", response);
    return {
      results: response.data.results || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    logApiError("Agency Spending", error);
    throw error;
  }
}