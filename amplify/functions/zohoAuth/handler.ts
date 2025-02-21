import { AuthenticationClient } from "./lib/zohoClient";

export async function handler(event, context) {
	try {
		const client = new AuthenticationClient({
			clientId: process.env.ZOHO_CLIENT_ID,
			clientSecret: process.env.ZOHO_CLIENT_SECRET,
			redirectUri: process.env.REDIRECT_URI,
		});

		switch (event.arguments?.operation || event.operation) {
			case "getAuthUrl":
				return {
					statusCode: 200,
					url: client.generateAuthUrl(["ZohoCRM.modules.ALL"]),
				};

			case "getTokens":
				const { code } = event.arguments;
				const tokens = await client.generateTokens(code);

				if (tokens.refresh_token) {
					await context.secrets.put("ZOHO_REFRESH_TOKEN", tokens.refresh_token);
				}

				return {
					statusCode: 200,
					accessToken: tokens.access_token,
					expiresIn: tokens.expires_in,
				};

			case "refreshToken":
				const refreshToken = await context.secrets.get("ZOHO_REFRESH_TOKEN");
				if (!refreshToken) {
					throw new Error("Refresh token not found");
				}

				const newTokens = await client.refreshAccessToken(refreshToken);
				return {
					statusCode: 200,
					accessToken: newTokens.access_token,
					expiresIn: newTokens.expires_in,
				};

			default:
				throw new Error("Invalid operation");
		}
	} catch (error) {
		console.error("Zoho Auth Error:", error);
		throw error;
	}
}
