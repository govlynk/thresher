import { AuthenticationClient } from "./lib/zohoClient";

export async function handler(event) {
	try {
		const client = new AuthenticationClient({
			clientId: process.env.ZOHO_CLIENT_ID,
			clientSecret: process.env.ZOHO_CLIENT_SECRET,
			redirectUri: process.env.REDIRECT_URI,
		});

		// For direct queries, the operation is in fieldName
		const operation = event.fieldName || event.arguments?.operation;

		switch (operation) {
			case "getZohoAuthUrl":
				const url = client.generateAuthUrl(["ZohoCRM.modules.ALL"]);
				return url; // Return URL directly for GraphQL string return type

			case "getZohoTokens":
				const { code } = event.arguments;
				const tokens = await client.generateTokens(code);
				return tokens;

			case "refreshZohoTokens":
				const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
				if (!refreshToken) {
					throw new Error("Refresh token not found");
				}
				const newTokens = await client.refreshAccessToken(refreshToken);
				return newTokens;

			default:
				throw new Error(`Invalid operation: ${operation}`);
		}
	} catch (error) {
		console.error("Zoho Auth Error:", error);
		throw error;
	}
}
