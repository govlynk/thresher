import { generateClient } from "aws-amplify/api";
import { formatCompanyData } from "../companyDataMapper.js";
import { initializeCompanyData } from "../setupUtils";

const apiClient = generateClient();
const dataClient = generateClient();

export async function refreshSamData(company) {
	if (!company?.uei) {
		throw new Error("Company UEI is required");
	}

	try {
		// Fetch fresh data from SAM.gov using Lambda
		const response = await apiClient.queries.getSamData({
			uei: company.uei,
			action: "entity",
		});

		console.log("Raw response:", response);
		console.log("typeof response", typeof response);

		// Step 1: Parse the outer data field
		const parsedData = JSON.parse(response.data);
		console.log("Parsed data:", parsedData);

		// Step 2: Parse the body field
		const body = typeof parsedData.body === "string" ? JSON.parse(parsedData.body) : parsedData.body;
		console.log("Parsed body:", body);

		const formattedData = formatCompanyData(body);
		console.log("pull formatted", formattedData);

		if (!formattedData) {
			throw new Error("No data found for the provided UEI");
		}

		const initializedData = initializeCompanyData(formattedData);
		console.log("pull initialized", initializedData);

		// Update company in database
		const updateResponse = await dataClient.models.Company.update({
			id: company.id,
			...initializedData,
			SAMPullDate: new Date().toISOString(),
		});
		console.log("pull response", updateResponse);

		return updateResponse.data;
	} catch (error) {
		console.error("Error refreshing SAM data:", error);
		throw error;
	}
}
