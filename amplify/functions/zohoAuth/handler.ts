import { AuthenticationClient } from "./lib/zohoClient";

export async function handler(event: any) {
	try {
		const client = new AuthenticationClient({
			clientId: process.env.ZOHO_CLIENT_ID!,
			clientSecret: process.env.ZOHO_CLIENT_SECRET!,
			redirectUri: process.env.REDIRECT_URI!,
		});

		// Extract authorization code from query parameters
		const code = event.queryStringParameters?.code;
		if (!code) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: "Authorization code is missing" }),
			};
		}

		// Exchange authorization code for tokens
		const tokens = await client.exchangeCodeForTokens(code);

		// Fetch user count
		const userCount = await client.getUserCount(tokens.access_token);

		return {
			statusCode: 200,
			body: JSON.stringify({ userCount }),
		};
	} catch (error) {
		console.error("Error:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message }),
		};
	}
}
