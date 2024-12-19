import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Setup SearchFields
const SearchReturnFields = [
	"Award ID",
	"Recipient Name",
	"Recipient Id",
	"Description",
	"Start Date",
	"End Date",
	"Last Modified Date",
	"Award Amount",
	"Awarding Agency",
	"Awarding Sub Agency",
	"Contract Award Type",
	"Award Type",
	"Funding Agency",
	"Funding Sub Agency",
	"Prime Award ID",
	"Prime Recipient Name",
	"Recipient Name",
	"Sub-Award Amount",
];

const spendingApi = axios.create({
	baseURL: "https://api.usaspending.gov/api/v2",
	headers: {
		"Content-Type": "application/json",
	},
});

// Helper function to format date range
const getDateRange = () => {
	const date = new Date();
	const endDate = date.toISOString().split("T")[0];
	const startDate = new Date(date.setFullYear(date.getFullYear() - 1)).toISOString().split("T")[0];
	return { startDate, endDate };
};

// Main query hook with improved error handling and validation
export function useSpendingReportsQuery(company) {
	return useQuery({
		queryKey: ["spendingReports", company?.naicsCode],
		queryFn: async () => {
			// Validate company data
			if (!company) {
				throw new Error("Company data is required");
			}

			if (!Array.isArray(company.naicsCode) || company.naicsCode.length === 0) {
				throw new Error("Company must have at least one NAICS code");
			}

			const { startDate, endDate } = getDateRange();
			const baseFilters = {
				time_period: [{ start_date: startDate, end_date: endDate }],
				award_type_codes: ["A", "B", "C", "D"],
				naics_codes: company.naicsCode,
			};

			try {
				// Execute all queries in parallel
				const [naicsSpending, agencySpending, geographicSpending] = await Promise.all([
					spendingApi.post("/search/spending_by_award/naics", {
						filters: baseFilters,
						fields: SearchReturnFields,
						page: 1,
						limit: 100,
						sort: "amount",
						order: "desc",
					}),
					spendingApi.post("/search/spending_by_category/awarding_agency", {
						filters: baseFilters,
						fields: SearchReturnFields,
						category: "awarding_agency",
						limit: 10,
					}),
					spendingApi.post("/search/spending_by_geography/", {
						filters: baseFilters,
						fields: SearchReturnFields,
						scope: "place_of_performance",
						geo_layer: "state",
					}),
				]);

				return {
					naicsSpending: naicsSpending.data,
					agencySpending: agencySpending.data,
					geographicSpending: geographicSpending.data,
				};
			} catch (error) {
				console.error("Error fetching spending reports:", error);
				throw new Error(error.response?.data?.message || error.message || "Failed to fetch spending reports");
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 30 * 60 * 1000, // 30 minutes
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		enabled: Boolean(company?.naicsCode?.length), // Only run query when company data is available
	});
}
