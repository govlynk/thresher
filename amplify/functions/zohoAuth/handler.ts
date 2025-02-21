import { AuthenticationClient } from "./lib/zohoClient";

export async function handler(event) {
	try {
		console.log("Event received:", JSON.stringify(event, null, 2));
		console.log("Environment variables:", {
			hasClientId: !!process.env.ZOHO_CLIENT_ID,
			hasClientSecret: !!process.env.ZOHO_CLIENT_SECRET,
			redirectUri: process.env.REDIRECT_URI,
		});

		const client = new AuthenticationClient({
			clientId: process.env.ZOHO_CLIENT_ID,
			clientSecret: process.env.ZOHO_CLIENT_SECRET,
			redirectUri: process.env.REDIRECT_URI,
		});

		// For direct queries, the operation is in fieldName
		const operation = event.fieldName || event.arguments?.operation;
		console.log("Operation:", operation);

		switch (operation) {
			case "getZohoAuthUrl":
				console.log("Generating auth URL with scopes:", ["ZohoCRM.modules.ALL"]);
				const url = client.generateAuthUrl(["ZohoCRM.modules.ALL"]);
				console.log("Generated URL:", url);
				return url; // Return URL directly for GraphQL string return type

			case "getZohoTokens":
				const { code } = event.arguments;
				console.log("Exchanging code for tokens:", { codeLength: code?.length });
				const tokens = await client.generateTokens(code);
				console.log("Received tokens:", {
					hasAccessToken: !!tokens.access_token,
					hasRefreshToken: !!tokens.refresh_token,
					expiresIn: tokens.expires_in,
				});
				return tokens;

			case "refreshZohoTokens":
				const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
				console.log("Refreshing tokens:", { hasRefreshToken: !!refreshToken });
				if (!refreshToken) {
					throw new Error("Refresh token not found");
				}
				const newTokens = await client.refreshAccessToken(refreshToken);
				console.log("Refreshed tokens:", {
					hasAccessToken: !!newTokens.access_token,
					expiresIn: newTokens.expires_in,
				});
				return newTokens;

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
