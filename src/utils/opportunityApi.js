import axios from "axios";

const formatQueryParams = (params) => {
	if (!params || Object.keys(params).length === 0) {
		return "";
	}

	return Object.entries(params)
		.map(([key, value]) => `${value}`)
		.join("&");
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

	const api_key = `api_key=${import.meta.env.VITE_SAM_API_KEY}`;
	const queryString = formatQueryParams(searchParams);
	const apiUrl = `https://api.sam.gov/opportunities/v2/search?${api_key}${queryString ? "&" + queryString : ""}`;
	console.log(apiUrl);

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

			if (!response.data?.opportunitiesData) {
				return [];
			}

			// Process and sanitize each opportunity
			const processedData = response.data.opportunitiesData
				.filter(Boolean)
				.map(processOpportunityData)
				.filter(Boolean);
			return processedData;
		} catch (error) {
			if (error.response?.status !== 429) {
				throw error;
			}
			lastError = error;

			// Check for "Retry-After" header
			const retryAfter = error.response.headers["retry-after"];
			const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, i) * 1000;
			console.log(`Retrying after ${delay}ms`, retryAfter);

			// Exponential backoff or wait for "Retry-After" duration
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}
