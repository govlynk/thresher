import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

// Fetch NAICS spending data
async function getNaicsSpending(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [
				{
					start_date: startDate,
					end_date: endDate,
				},
			],
			award_type_codes: [
				"A",
				"B",
				"C",
				"D", // All contract types
			],
			naics_codes: naicsCodes,
		},
		fields: [
			"Award ID",
			"Recipient Name",
			"Description",
			"Start Date",
			"End Date",
			"Award Amount",
			"Awarding Agency",
			"Awarding Sub Agency",
			"NAICS Code",
			"NAICS Description",
		],
		page: 1,
		limit: 100,
		sort: "Award Amount",
		order: "desc",
		subawards: false,
	};

	const response = await spendingApi.post("/search/spending_by_award/", params);
	return response.data;
}

// Fetch agency spending data
async function getAgencySpending(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [
				{
					start_date: startDate,
					end_date: endDate,
				},
			],
			award_type_codes: ["A", "B", "C", "D"],
			naics_codes: naicsCodes,
		},
		category: "awarding_agency",
		limit: 10,
		page: 1,
	};

	const response = await spendingApi.post("/search/spending_by_category/", params);
	return response.data;
}

// Fetch geographic spending data
async function getGeographicSpending(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [
				{
					start_date: startDate,
					end_date: endDate,
				},
			],
			award_type_codes: ["A", "B", "C", "D"],
			naics_codes: naicsCodes,
		},
		scope: "place_of_performance",
		geo_layer: "state",
		page: 1,
		limit: 100,
	};

	const response = await spendingApi.post("/search/spending_by_geography/", params);
	return response.data;
}

// Fetch competitor data
async function getCompetitorData(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [
				{
					start_date: startDate,
					end_date: endDate,
				},
			],
			award_type_codes: ["A", "B", "C", "D"],
			naics_codes: naicsCodes,
		},
		category: "recipient_duns",
		limit: 10,
		page: 1,
	};

	const response = await spendingApi.post("/search/spending_by_category/", params);
	return response.data;
}

// Fetch vendor performance data
async function getVendorPerformance(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [
				{
					start_date: startDate,
					end_date: endDate,
				},
			],
			award_type_codes: ["A", "B", "C", "D"],
			naics_codes: naicsCodes,
		},
		fields: [
			"Award ID",
			"Recipient Name",
			"Award Amount",
			"Start Date",
			"End Date",
			"Period of Performance Current End Date",
			"Period of Performance Start Date",
			"Contract Award Type",
			"Description",
		],
		page: 1,
		limit: 100,
		sort: "Award Amount",
		order: "desc",
	};

	const response = await spendingApi.post("/search/spending_by_award/", params);
	return response.data;
}

// Fetch subcontracting opportunities
async function getSubcontractingData(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [
				{
					start_date: startDate,
					end_date: endDate,
				},
			],
			award_type_codes: ["A", "B", "C", "D"],
			naics_codes: naicsCodes,
			award_amounts: [
				{
					lower_bound: 5000000, // Contracts over $5M likely to have subcontracting
				},
			],
		},
		fields: [
			"Award ID",
			"Recipient Name",
			"Award Amount",
			"Description",
			"NAICS Code",
			"NAICS Description",
			"Awarding Agency",
			"Awarding Sub Agency",
			"Place of Performance City Name",
			"Place of Performance State Code",
			"Place of Performance Country Code",
		],
		page: 1,
		limit: 100,
		sort: "Award Amount",
		order: "desc",
	};

	const response = await spendingApi.post("/search/spending_by_award/", params);
	return response.data;
}

// Main query hook
export function useSpendingReportsQuery(company) {
	return useQuery({
		queryKey: ["spendingReports", company?.naicsCode],
		queryFn: async () => {
			if (!company?.naicsCode?.length) {
				throw new Error("No NAICS codes available");
			}

			try {
				const [
					naicsSpending,
					agencySpending,
					geographicSpending,
					competitorData,
					vendorPerformance,
					subcontractingData,
				] = await Promise.all([
					getNaicsSpending(company.naicsCode),
					getAgencySpending(company.naicsCode),
					getGeographicSpending(company.naicsCode),
					getCompetitorData(company.naicsCode),
					getVendorPerformance(company.naicsCode),
					getSubcontractingData(company.naicsCode),
				]);

				return {
					naicsSpending,
					agencySpending,
					geographicSpending,
					competitorData,
					vendorPerformance,
					subcontractingData,
				};
			} catch (error) {
				console.error("Error fetching spending reports:", error);
				throw new Error(error.response?.data?.message || "Failed to fetch spending reports");
			}
		},
		staleTime: 1000 * 60 * 15, // 15 minutes
		cacheTime: 1000 * 60 * 60, // 1 hour
		enabled: !!company?.naicsCode?.length,
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
}
