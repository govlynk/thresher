import { spendingApi, logApiResponse, logApiError } from "../api";

export async function getGeographicSpending(filters) {
	try {
		const response = await spendingApi.post("/search/spending_by_geography", {
			filters,
			scope: "place_of_performance",
			geo_layer: "state",
			// geo_layer_filters: [],
		});
		logApiResponse("Geographic Spending", response);
		return {
			results: response.data.results || [],
			total: response.data.total || 0,
		};
	} catch (error) {
		logApiError("Geographic Spending", error);
		throw error;
	}
}
