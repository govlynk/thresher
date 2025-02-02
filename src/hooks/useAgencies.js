import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
	baseURL: "https://api.usaspending.gov/api/v2",
	headers: {
		"Content-Type": "application/json",
	},
});

async function fetchAgencies() {
	const response = await api.get("/references/toptier_agencies", {
		params: {
			sort: "agency_name",
			order: "asc",
		},
	});
	// Ensure agency_id is kept as a string to preserve leading zeros
	return response.data.results.map((agency) => ({
		...agency,
		toptier_code: String(agency.toptier_code).padStart(3, "0"),
	}));
}

// https://www.usaspending.gov/graphics/icons.svg

export function useAgencies() {
	return useQuery({
		queryKey: ["agencies"],
		queryFn: fetchAgencies,
		staleTime: 24 * 60 * 60 * 1000, // 24 hours
		cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
}
