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
	baseURL: "https://api.usaspending.gov/api/v2/search/",
});

// Helper function to format date range
const getDateRange = () => {
	const date = new Date();
	const endDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
		date.getDate()
	).padStart(2, "0")}`;
	const startDate = `${date.getFullYear() - 1}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
		date.getDate()
	).padStart(2, "0")}`;
	console.log("startDate", startDate);
	console.log("endDate", endDate);
	return { startDate, endDate };
};

// Invoke USASpending API
const url = spendingApi.defaults.baseURL + "spending_by_award/";
const headers = {
	"Content-Type": "application/json",
};

// Fetch NAICS spending data
async function getNaicsSpending(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	// Setup filters using Map
	const filters = {
		time_period: [
			{
				start_date: startDate,
				end_date: endDate,
			},
		],
		award_type_codes: ["IDV_D", "IDV_B_A", "A", "IDV_E", "IDV_B_B", "B", "02", "IDV_B_C", "C", "03", "D"],
		naics_codes: naicsCodes,
	};

	// Setup parameters
	const params = {
		category: "naics",
		subawards: "false",
		limit: 10,
		page: 1,
		fields: SearchReturnFields,
		filters: filters,
	};

	// const response = await spendingApi.post("/search/spending_by_category/", params);
	const response = await spendingApi.post(url, params, { headers: headers });
	console.log("---->", params);
	console.log("---->", response.data);
	return response.data;
}

// Fetch agency spending data
async function getAgencySpending(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [{ start_date: startDate, end_date: endDate }],
			naics_codes: naicsCodes,
		},
		group: "awarding_agency",
		subawards: false,
	};

	const response = await spendingApi.post("/search/spending_by_category/", params);
	return response.data;
}

// Fetch geographic spending data
async function getGeographicSpending(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [{ start_date: startDate, end_date: endDate }],
			naics_codes: naicsCodes,
		},
		group: "recipient_location",
		subawards: false,
	};

	const response = await spendingApi.post("/search/spending_by_geography/", params);
	return response.data;
}

// Fetch competitor data
async function getCompetitorData(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [{ start_date: startDate, end_date: endDate }],
			naics_codes: naicsCodes,
		},
		group: "recipient_duns",
		subawards: false,
	};

	const response = await spendingApi.post("/search/spending_by_category/", params);
	return response.data;
}

// Fetch vendor performance data
async function getVendorPerformance(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [{ start_date: startDate, end_date: endDate }],
			naics_codes: naicsCodes,
		},
		fields: ["Award ID", "Recipient Name", "Award Amount", "Start Date", "End Date", "Award Type", "Description"],
	};

	const response = await spendingApi.post("/search/spending_by_award/", params);
	return response.data;
}

// Fetch subcontracting opportunities
async function getSubcontractingData(naicsCodes) {
	const { startDate, endDate } = getDateRange();

	const params = {
		filters: {
			time_period: [{ start_date: startDate, end_date: endDate }],
			naics_codes: naicsCodes,
			award_amount: [5000000, null], // Contracts over $5M likely to have subcontracting
		},
		fields: ["Award ID", "Recipient Name", "Award Amount", "Description", "NAICS Code", "NAICS Description"],
	};

	const response = await spendingApi.post("/search/spending_by_award/", params);
	return response.data;
}

// Main query hook
export function useSpendingReportsQuery(company) {
	console.log("company", company);
	return useQuery({
		queryKey: ["spendingReports", company?.naicsCode],
		queryFn: async () => {
			if (!company?.naicsCode?.length) {
				throw new Error("No NAICS codes available");
			}

			const [
				naicsSpending,
				// agencySpending,
				// geographicSpending,
				// competitorData,
				// vendorPerformance,
				// subcontractingData,
			] = await Promise.all([
				getNaicsSpending(company.naicsCode),
				// getAgencySpending(company.naicsCode),
				// getGeographicSpending(company.naicsCode),
				// getCompetitorData(company.naicsCode),
				// getVendorPerformance(company.naicsCode),
				// getSubcontractingData(company.naicsCode),
			]);

			return {
				naicsSpending,
				// agencySpending,
				// geographicSpending,
				// competitorData,
				// vendorPerformance,
				// subcontractingData,
			};
		},
		staleTime: 1000 * 60 * 15, // 15 minutes
		cacheTime: 1000 * 60 * 60, // 1 hour
		enabled: !!company?.naicsCode?.length,
	});
}
