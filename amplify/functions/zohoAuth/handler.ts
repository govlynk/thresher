import { AuthenticationClient } from "./lib/zohoClient";

export async function handler(event) {
	try {
		console.log("Event received:", JSON.stringify(event, null, 2));
		console.log("Environment variables:", {
			hasClientId: !!process.env.ZOHO_CLIENT_ID,
			hasClientSecret: !!process.env.ZOHO_CLIENT_SECRET,
			hasRefreshToken: !!process.env.ZOHO_REFRESH_TOKEN,
		});

		const client = new AuthenticationClient({
			clientId: process.env.ZOHO_CLIENT_ID,
			clientSecret: process.env.ZOHO_CLIENT_SECRET,
			refreshToken: process.env.ZOHO_REFRESH_TOKEN,
		});

		// For direct queries, the operation is in fieldName
		const operation = event.fieldName || event.arguments?.operation;
		console.log("Operation:", operation);

		switch (operation) {
			case "refreshZohoTokens":
				const refreshedTokens = await client.getAccessToken();
				console.log("Refreshed tokens:", {
					hasAccessToken: !!refreshedTokens.access_token,
					expiresIn: refreshedTokens.expires_in,
				});
				return refreshedTokens;

			default:
				throw new Error(`Invalid operation: ${operation}`);
		}
	} catch (error) {
		console.error("Zoho Auth Error:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		});
		throw error;
	}
}
