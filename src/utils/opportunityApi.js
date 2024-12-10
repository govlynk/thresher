import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const formatQueryParams = (params) => {
	if (!params || Object.keys(params).length === 0) {
		return "";
	}

	const queryParams = [];

	// Format NAICS codes
	if (params.naicsCode) {
		queryParams.push(`naics=${params.naicsCode}`);
	}

	// Format dates
	if (params.postedFrom) {
		queryParams.push(`postedFrom=${params.postedFrom}`);
	}

	if (params.postedTo) {
		queryParams.push(`postedTo=${params.postedTo}`);
	}

	// Add limit
	if (params.limit) {
		queryParams.push(`limit=${params.limit}`);
	}

	// Add ptype for procurement types
	queryParams.push(`ptype=k,o,p`);

	return queryParams.join("&");
};

const processOpportunityData = (opportunity) => {
	if (!opportunity) return null;

	return {
		...opportunity,
		department: opportunity.department?.name || opportunity.departmentName || "N/A",
		subtier: opportunity.subtierAgency?.name || opportunity.subtierAgencyName || "N/A",
		office: opportunity.office?.name || opportunity.officeName || "N/A",
	};
};

export async function getOpportunity(searchParams) {
	if (!import.meta.env.VITE_SAM_API_KEY) {
		throw new Error("SAM API key is not configured");
	}

	console.log("getOpportunity called with params:", searchParams);

	const api_key = import.meta.env.VITE_SAM_API_KEY;
	const queryString = formatQueryParams(searchParams);
	const apiUrl = `https://api.sam.gov/opportunities/v2/search?api_key=${api_key}${
		queryString ? "&" + queryString : ""
	}`;

	console.log("Constructed API URL:", apiUrl);

	const maxRetries = 3;
	let lastError;

	for (let i = 0; i < maxRetries; i++) {
		try {
			const response = await axios.get(apiUrl, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			console.log("API Response:", response.data);

			if (!response.data?.opportunitiesData) {
				return [];
			}

			const processedData = response.data.opportunitiesData
				.filter(Boolean)
				.map(processOpportunityData)
				.filter(Boolean);

			console.log("Processed opportunities:", processedData.length);
			return processedData;
		} catch (error) {
			console.error("API request error:", error);
			if (error.response?.status !== 429) {
				throw error;
			}
			lastError = error;

			const retryAfter = error.response.headers["retry-after"];
			const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, i) * 1000;
			console.log(`Retrying after ${delay}ms (attempt ${i + 1}/${maxRetries})`);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}

export function useOpportunityQuery(searchParams) {
	return useQuery({
		queryKey: ["opportunities", searchParams],
		queryFn: async () => {
			console.log("Query function executing with params:", searchParams);
			if (!searchParams) {
				console.log("No search params provided, returning empty array");
				return [];
			}
			return getOpportunity(searchParams);
		},
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		enabled: !!searchParams, // Only run query if searchParams exists
	});
}
