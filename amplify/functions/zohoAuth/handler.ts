import { AuthenticationClient } from "./lib/zohoClient";

// Add a helper to collect logs
function createLogger() {
	const logs: Array<{ timestamp: string; message: string; data?: any }> = [];

	return {
		log: (message: string, data?: any) => {
			const logEntry = {
				timestamp: new Date().toISOString(),
				message,
				data,
			};
			console.log(message, data); // Still log to CloudWatch
			logs.push(logEntry);
		},
		getLogs: () => logs,
	};
}

export async function handler(event) {
	const logger = createLogger();

	try {
		logger.log("Event received:", event);

		// Debug environment variables
		const clientId = process.env.ZOHO_CLIENT_ID;
		const clientSecret = process.env.ZOHO_CLIENT_SECRET;
		const redirectUri = process.env.REDIRECT_URI;

		logger.log("Environment variables:", {
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
		logger.log("Operation:", operation);

		switch (operation) {
			case "getZohoAuthUrl":
				const scopes = ["ZohoCRM.modules.ALL"];
				logger.log("Generating auth URL with scopes:", scopes);
				const url = client.generateAuthUrl(scopes);
				logger.log("Generated URL:", url);
				return {
					url,
					logs: logger.getLogs(),
				};

			case "getZohoTokens":
				const { code } = event.arguments;
				logger.log("Exchanging code for tokens:", {
					codeLength: code?.length,
					codeFirstChars: code?.substring(0, 8),
				});
				const tokens = await client.exchangeCodeForTokens(code);

				// Get user count using the new access token
				const userCount = await client.getUserCount(tokens.access_token);

				return {
					accessToken: tokens.access_token,
					refreshToken: tokens.refresh_token,
					expiresIn: tokens.expires_in,
					userCount,
					logs: logger.getLogs(),
				};

			case "refreshZohoTokens":
				const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
				logger.log("Refreshing tokens:", { hasRefreshToken: !!refreshToken });
				if (!refreshToken) {
					throw new Error("Refresh token not found");
				}
				const newTokens = await client.refreshAccessToken(refreshToken);
				logger.log("Refreshed tokens response:", {
					hasAccessToken: !!newTokens.access_token,
					expiresIn: newTokens.expires_in,
					apiDomain: newTokens.api_domain,
				});
				return newTokens;

			default:
				throw new Error(`Invalid operation: ${operation}`);
		}
	} catch (error) {
		logger.log("Error:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
			status: error.status,
			response: error.response?.data,
		});
		throw error;
	}
}
