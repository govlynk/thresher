import axios from "axios";
import type { Schema } from "../../../data/resource";
// Types for API responses and parameters
interface ApiEvent {
	queryStringParameters?: {
		uei?: string;
		action?: "repsAndCerts" | "entity";
	};
}

interface ApiResponse {
	statusCode: number;
	headers: {
		[key: string]: string;
	};
	body: string;
}

// Helper functions
const sanitizeData = (data: any): any => {
	if (!data) return null;
	return JSON.parse(JSON.stringify(data));
};

const buildSamApiUrl = (uei: string, includeSections: string = ""): string => {
	const baseUrl = "https://api.sam.gov/entity-information/v3/entities";
	const apiKey = process.env.SAM_API_KEY;

	if (!apiKey) {
		throw new Error("SAM_API_KEY environment variable is not set");
	}

	const params = new URLSearchParams({
		api_key: apiKey, // Use the retrieved API key
		ueiSAM: uei,
		...(includeSections && { includeSections }),
	});

	console.log("params", params.toString());
	console.log("baseUrl", baseUrl);

	return `${baseUrl}?${params.toString()}`;
};

const handleApiResponse = async (response: any, section: string = ""): Promise<any> => {
	if (response.status !== 200) {
		console.error(`SAM API Error: ${response.status}`, response.data);
		throw new Error("Failed to fetch data from SAM API");
	}

	const entityData = response.data.entityData?.[0];
	if (!entityData) {
		console.error("No entity data found in response");
		throw new Error("No entity data found");
	}

	const dataToSanitize = section ? entityData[section] : entityData;
	return sanitizeData(dataToSanitize);
};

export const handler: Schema["getSamData"]["functionHandler"] = async (event) => {
	console.log("Event received:", JSON.stringify(event));
	const { uei, action } = event.arguments;

	if (!uei) {
		throw new Error("UEI parameter is required");
	}

	let response;
	let data;

	switch (action) {
		case "repsAndCerts":
			console.log("Fetching reps and certs for UEI:", uei);
			response = await axios.get(buildSamApiUrl(uei, "repsAndCerts"));
			data = await handleApiResponse(response, "repsAndCerts");
			break;

		case "entity":
		default:
			console.log("Fetching entity data for UEI:", uei);
			response = await axios.get(buildSamApiUrl(uei));

			data = response.data.entityData?.[0];
			console.log("%%% raw data", data);
			if (!data) {
				throw new Error("No entity data found");
			}
			break;
	}

	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify(data),
	};
};
