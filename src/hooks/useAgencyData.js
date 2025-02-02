import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
	baseURL: "https://api.usaspending.gov/api/v2",
	headers: {
		"Content-Type": "application/json",
	},
});

async function fetchAgencySpending() {
	try {
		const response = await axios.post("https://api.usaspending.gov/api/v2/references/toptier_agencies", {
			sort: "obligated_amount",
			order: "desc",
		});

		const results = response.data.results || [];
		const total = results.reduce((sum, agency) => sum + agency.obligated_amount, 0);
		console.log("Agency spending data:", results); // Debug log
		console.log("Total agency spending:", total); // Debug log

		// Sort agencies by amount and get top 10
		const topAgencies = results.sort((a, b) => b.obligated_amount - a.obligated_amount).slice(0, 10);

		console.log("Top agencies:", topAgencies); // Debug log
		// Calculate "All Others" amount
		const othersAmount = results
			.sort((a, b) => b.obligated_amount - a.obligated_amount)
			.slice(10)
			.reduce((sum, agency) => sum + agency.obligated_amount, 0);

		// Format final data
		return {
			results: [
				...topAgencies.map((agency) => ({
					name: agency.agency_name,
					code: agency.toptier_code,
					amount: agency.obligated_amount,
					percentage: Number(((agency.obligated_amount / total) * 100).toFixed(1)),
					sortIndex: agency.obligated_amount, // Add sort value
				})),
				{
					name: "All Others",
					code: "others",
					amount: othersAmount,
					percentage: Number(((othersAmount / total) * 100).toFixed(1)),
					sortIndex: 0, // Ensure "All Others" appears last
				},
			],
			total,
			fiscalYear: 2025,
		};
	} catch (error) {
		console.error("Error fetching agency spending:", error);
		throw error;
	}
}

async function fetchAgencyData(toptier_code, fiscalYear) {
	if (!toptier_code) return null;

	// Ensure agencyId is a string with leading zeros
	const formattedAgencyId = String(toptier_code).padStart(3, "0");

	const [
		idvResponse,
		contractsResponse,
		budgetaryResources,
		awardCounts,
		obligationsByCategory,
		agencyOverview,
		subAgencySpending,
	] = await Promise.all([
		// IDV Awards
		api.get(`/agency/${formattedAgencyId}/sub_agency/`, {
			params: {
				fiscal_year: fiscalYear,
				award_type_codes: ["IDV_A", "IDV_B", "IDV_B_A", "IDV_B_B", "IDV_B_C", "IDV_C", "IDV_D", "IDV_E"],
				limit: 10,
				page: 1,
				sort: "total_obligations",
				order: "desc",
			},
		}),
		// Contracts
		api.get(`/agency/${formattedAgencyId}/sub_agency/`, {
			params: {
				fiscal_year: fiscalYear,
				award_type_codes: ["A", "B", "C", "D"],
				limit: 10,
				page: 1,
				sort: "total_obligations",
				order: "desc",
			},
		}),
		// Budgetary Resources
		api.get(`/agency/${formattedAgencyId}/budgetary_resources/`, {
			params: { fiscal_year: fiscalYear },
		}),
		// Award Counts
		api.get(`/agency/${formattedAgencyId}/awards/`, {
			params: { fiscal_year: fiscalYear },
		}),
		// Obligations by Category
		api.get(`/agency/${formattedAgencyId}/obligations_by_award_category/`, {
			params: { fiscal_year: fiscalYear },
			transformResponse: [
				(data) => {
					const parsed = JSON.parse(data);
					return parsed;
				},
			],
		}),
		api.get(`/agency/${formattedAgencyId}/`),
		api.get(`/agency/${formattedAgencyId}/sub_agency/`, {
			params: {
				fiscal_year: fiscalYear,
				limit: 10,
				page: 1,
				sort: "total_obligations",
				order: "desc",
			},
		}),
	]);

	// https://api.usaspending.gov/api/v2/agency/097/sub_agency/?fiscal_year=2025&award_type_codes=[IDV_A,IDV_B,IDV_B_A,IDV_B_B,IDV_B_C,IDV_C,IDV_D,IDV_E]&limit=10&page=1&sort=total_obligations&order=desc
	// https://api.usaspending.gov/api/v2/agency/097/sub_agency/?fiscal_year=2025&award_type_codes=[A,B,C,D]&limit=10&page=1&sort=total_obligations&order=desc
	// https://api.usaspending.gov/api/v2/agency/097/?fiscal_year=2025
	// https://api.usaspending.gov/api/v2/agency/097/budgetary_resources
	// https://api.usaspending.gov/api/v2/agency/097/sub_components/?fiscal_year=2025&page=1
	// https://api.usaspending.gov/api/v2/agency/097/awards/new/count/?fiscal_year=2025
	//	https://api.usaspending.gov/api/v2/agency/097/obligations_by_award_category/?fiscal_year=2025
	// https://api.usaspending.gov/api/v2/agency/097/budgetary_resources/
	// https://api.usaspending.gov/api/v2/agency/097/awards/?fiscal_year=2025
	// https://api.usaspending.gov/api/v2/agency/097/sub_agency/?fiscal_year=2025&limit=10&page=1&sort=total_obligations&order=desc

	return {
		idv_spending: idvResponse.data.results || [],
		contract_spending: contractsResponse.data.results || [],
		budgetary_resources: budgetaryResources.data || {},
		award_counts: awardCounts.data.transaction_count || 0,
		obligations_by_category: obligationsByCategory.data.results || [],
		agency_overview: agencyOverview.data,
		sub_agency_spending: subAgencySpending.data.results || [],
	};
}

export function useAgencyData(toptier_code, fiscalYear) {
	return useQuery({
		queryKey: ["agencyData", toptier_code, fiscalYear],
		queryFn: () => fetchAgencyData(toptier_code, fiscalYear),
		enabled: !!toptier_code,
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 30 * 60 * 1000, // 30 minutes
	});
}

export function useAgencySpending() {
	return useQuery({
		queryKey: ["agencySpending"],
		queryFn: fetchAgencySpending,
		// staleTime: 5 * 60 * 1000, // 5 minutes
		// cacheTime: 30 * 60 * 1000, // 30 minutes
	});
}
