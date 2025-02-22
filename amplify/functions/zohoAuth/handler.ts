import { AuthenticationClient } from "./lib/zohoClient";

export async function handler(event) {
	try {
		console.log("Event received:", JSON.stringify(event, null, 2));

		// Debug environment variables
		const clientId = process.env.ZOHO_CLIENT_ID;
		const clientSecret = process.env.ZOHO_CLIENT_SECRET;
		const redirectUri = process.env.REDIRECT_URI;

		console.log("Environment variables:", {
			clientIdLength: clientId?.length,
			clientIdFirstChars: clientId?.substring(0, 8),
			clientIdLastChars: clientId?.substring(-8),
			hasClientSecret: !!clientSecret,
			clientSecretLength: clientSecret?.length,
			redirectUri,
		});

		// Validate required environment variables
		if (!clientId) throw new Error("ZOHO_CLIENT_ID is not set");
		if (!clientSecret) throw new Error("ZOHO_CLIENT_SECRET is not set");
		if (!redirectUri) throw new Error("REDIRECT_URI is not set");

		const client = new AuthenticationClient({
			clientId,
			clientSecret,
			redirectUri,
		});

		const operation = event.fieldName || event.arguments?.operation;
		console.log("Operation:", operation);

		switch (operation) {
			case "getZohoAuthUrl":
				const scopes = ["ZohoCRM.modules.ALL"];
				console.log("Generating auth URL with scopes:", scopes);
				const url = client.generateAuthUrl(scopes);
				console.log("Generated URL components:", {
					baseUrl: url.split("?")[0],
					params: new URLSearchParams(url.split("?")[1]).toString(),
					fullUrl: url,
				});
				return url;

			case "getZohoTokens":
				const { code } = event.arguments;
				console.log("Exchanging code for tokens:", {
					codeLength: code?.length,
					codeFirstChars: code?.substring(0, 8),
				});
				const tokens = await client.exchangeCodeForTokens(code);
				console.log("Received tokens response:", {
					hasAccessToken: !!tokens.access_token,
					hasRefreshToken: !!tokens.refresh_token,
					expiresIn: tokens.expires_in,
					apiDomain: tokens.api_domain,
				});
				return tokens;

			case "refreshZohoTokens":
				const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
				console.log("Refreshing tokens:", { hasRefreshToken: !!refreshToken });
				if (!refreshToken) {
					throw new Error("Refresh token not found");
				}
				const newTokens = await client.refreshAccessToken(refreshToken);
				console.log("Refreshed tokens response:", {
					hasAccessToken: !!newTokens.access_token,
					expiresIn: newTokens.expires_in,
					apiDomain: newTokens.api_domain,
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
			status: error.status,
			response: error.response?.data,
		});
		throw error;
	}
}
