import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
	baseURL: "https://api.usaspending.gov/api/v2",
	headers: {
		"Content-Type": "application/json",
	},
});

const getDateRange = () => {
	const date = new Date();
	const endDate = date.toISOString().split("T")[0];
	const startDate = new Date(date.setFullYear(date.getFullYear() - 1)).toISOString().split("T")[0];
	return { startDate, endDate };
};

async function fetchSpendingData(filters) {
	try {
		const [naicsResponse, agencyResponse, geoResponse, spendingResponse] = await Promise.all([
			// NAICS spending
			api.post("/search/spending_by_category/naics", {
				filters,
				category: "naics",
				limit: 100,
			}),
			// Agency spending
			api.post("/search/spending_by_category/awarding_agency", {
				filters,
				category: "awarding_agency",
				limit: 10,
			}),
			// Geographic spending
			api.post("/search/spending_by_geography", {
				filters,
				scope: "place_of_performance",
				geo_layer: "state",
			}),
			// Overall spending
			api.post("/search/spending_by_award", {
				filters,
				fields: [
					"Award ID",
					"Recipient Name",
					"Description",
					"Start Date",
					"End Date",
					"Award Amount",
					"Awarding Agency",
					"Awarding Sub Agency",
				],
				limit: 100,
			}),
		]);

		return {
			naicsSpending: naicsResponse.data,
			agencySpending: agencyResponse.data,
			geographicSpending: geoResponse.data,
			spendingData: spendingResponse.data,
		};
	} catch (error) {
		console.error("Error fetching spending data:", error);
		throw error;
	}
}

export function useSpendingReportsQuery(company) {
	return useQuery({
		queryKey: ["spendingReports", company?.naicsCode],
		queryFn: async () => {
			if (!company?.naicsCode?.length) {
				throw new Error("Company must have at least one NAICS code");
			}

			const { startDate, endDate } = getDateRange();
			const filters = {
				time_period: [{ start_date: startDate, end_date: endDate }],
				award_type_codes: ["A", "B", "C", "D"],
				naics_codes: company.naicsCode,
			};

			return fetchSpendingData(filters);
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 30 * 60 * 1000, // 30 minutes
		enabled: Boolean(company?.naicsCode?.length),
	});
}
