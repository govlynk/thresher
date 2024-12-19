import { spendingApi, logApiResponse, logApiError } from "../api";

export async function getNaicsSpending(filters) {
  try {
    const response = await spendingApi.post("/search/spending_by_category/naics", {
      filters,
      category: "naics",
      limit: 100,
      page: 1,
    });
    logApiResponse("NAICS Spending", response);
    return {
      results: response.data.results || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    logApiError("NAICS Spending", error);
    throw error;
  }
}