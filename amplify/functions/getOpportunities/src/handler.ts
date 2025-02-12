import axios from "axios";
import type { Schema } from "../../../data/resource";

// Types for API request parameters
interface QueryParams {
	naicsCode?: string;
	agency?: string;
	setAside?: string;
	state?: string;
	limit?: number;
	offset?: number;
	sourceType?: string;
	searchId?: string;
	capturedDate?: string;
	postedDate?: string;
	sourceId?: string;
	agencyKey?: string;
	oppKey?: string;
}

interface ApiEvent {
	queryStringParameters?: QueryParams;
}

interface ApiResponse {
	statusCode: number;
	headers: {
		[key: string]: string;
	};
	body: string;
}

// Helper function to build the API URL with query parameters
const buildApiUrl = (params: QueryParams = {}): string => {
	const baseUrl = "https://www.highergov.com/api-external/opportunity/";

	// Filter out undefined values and ensure all values are strings
	const filteredParams = Object.fromEntries(
		Object.entries({
			api_key: "fcaeb9a65c6a4a08bd1c3e3c2986c5ef",
			limit: params.limit?.toString() || "10",
			offset: params.offset?.toString() || "0",
			posted_date: params.postedDate,
			search_id: params.searchId,
			naics_code: params.naicsCode,
			agency: params.agency,
			set_aside: params.setAside,
			state: params.state,
			source_type: params.sourceType,
		}).filter(([_, value]) => value !== undefined && value !== "") as [string, string][]
	);

	const queryParams = new URLSearchParams(filteredParams);
	console.log("Query Params:", queryParams.toString());
	return `${baseUrl}?${queryParams.toString()}`;
};

// Main handler function
export const handler: Schema["getOpportunities"]["functionHandler"] = async (event) => {
	console.log("Event received:", event);
	const { naicsCode, agency, setAside, state, limit, offset, sourceType, searchId, postedDate } = event.arguments;

	try {
		const apiUrl = buildApiUrl({
			naicsCode: naicsCode || undefined,
			agency: agency || undefined,
			setAside: setAside || undefined,
			state: state || undefined,
			limit: limit || undefined,
			offset: offset || undefined,
			sourceType: sourceType || undefined,
			searchId: searchId || undefined,
			postedDate: postedDate || undefined,
		});

		console.log("Calling HigherGov API:", apiUrl);
		const response = await axios.get(apiUrl, {
			headers: {
				Accept: "application/json",
			},
			timeout: 25000, // 25 second timeout
		});

		// Make sure we're returning a properly structured response
		console.log("%%% response", response.data);
		// Ensure we're working with parsed JSON
		const data = typeof response.data === "string" ? JSON.parse(response.data.replace(/\\/g, "")) : response.data;

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				items:
					data.results.map((item: any) => ({
						...item,
						ai_summary: item.ai_summary || item.aiSummary || null,
					})) || [],
			}),
		};
	} catch (error: any) {
		console.error("Lambda execution error:", error.response?.data || error.message);
		throw new Error(error.message || "Internal server error");
	}
};
