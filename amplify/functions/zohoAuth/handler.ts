import { AuthenticationClient } from "./lib/zohoClient";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { AppSyncResolverHandler } from "aws-lambda";

// Add a helper to collect logs
function createLogger() {
	const logs: Array<{ timestamp: string; message: string; data?: any }> = [];
	return {
		log: (message: string, data?: any) => {
			const logEntry = { timestamp: new Date().toISOString(), message, data };
			console.log(message, data); // Log to CloudWatch
			logs.push(logEntry);
		},
		getLogs: () => logs,
	};
}

// Update the event type
type AppSyncEvent = {
	fieldName: string;
	arguments: Record<string, any>;
};

type ZohoEvent = APIGatewayProxyEventV2WithJWTAuthorizer | AppSyncEvent;

export async function handler(event: ZohoEvent) {
	const logger = createLogger();

	try {
		// Handle HTTP API request
		if ("requestContext" in event && event.requestContext?.http) {
			return handleHttpRequest(event as APIGatewayProxyEventV2WithJWTAuthorizer, logger);
		}

		// Handle AppSync operations
		return handleAppSyncRequest(event as AppSyncEvent, logger);
	} catch (error) {
		logger.log("Unhandled error:", error);
		throw error;
	}
}

async function handleHttpRequest(event: APIGatewayProxyEventV2WithJWTAuthorizer, logger: any) {
	logger.log("Event received:", event);

	// Handle HTTP API request
	if (event.requestContext?.http) {
		const code = event.queryStringParameters?.code;
		if (!code) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: "No authorization code received" }),
			};
		}

		try {
			const client = new AuthenticationClient({
				clientId: process.env.ZOHO_CLIENT_ID,
				clientSecret: process.env.ZOHO_CLIENT_SECRET,
				redirectUri: process.env.REDIRECT_URI,
			});

			// Exchange code for tokens
			const tokens = await client.exchangeCodeForTokens(code);

			// Get user count
			const userCount = await client.getUserCount(tokens.access_token);

			// Store tokens securely (e.g., in a database or user session)
			await updateUserAttributes(event, tokens);

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: "Authorization successful",
					userCount,
				}),
			};
		} catch (error) {
			logger.log("Error during token exchange or user count retrieval:", error);
			return {
				statusCode: 500,
				body: JSON.stringify({ error: error.message }),
			};
		}
	}
}

async function handleAppSyncRequest(event: AppSyncEvent, logger: any) {
	// Handle AppSync operations
	const operation = event.fieldName;

	logger.log("Operation:", operation);

	if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET || !process.env.REDIRECT_URI) {
		throw new Error("Missing required environment variables");
	}

	const client = new AuthenticationClient({
		clientId: process.env.ZOHO_CLIENT_ID,
		clientSecret: process.env.ZOHO_CLIENT_SECRET,
		redirectUri: process.env.REDIRECT_URI,
	});

	switch (operation) {
		case "getZohoAuthUrl":
			const scopes = ["ZohoCRM.modules.ALL"];
			logger.log("Generating auth URL with scopes:", scopes);
			return client.generateAuthUrl(scopes);

		case "getZohoTokens":
			const { code } = event.arguments;
			logger.log("Exchanging code for tokens:", { code });
			const tokens = await client.exchangeCodeForTokens(code);
			const userCount = await client.getUserCount(tokens.access_token);
			return { ...tokens, userCount };

		case "refreshZohoTokens":
			const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
			if (!refreshToken) throw new Error("Refresh token not found");
			return await client.refreshAccessToken(refreshToken);

		default:
			throw new Error(`Invalid operation: ${operation}`);
	}
}

async function updateUserAttributes(event, tokens) {
	const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
	if (!userId) throw new Error("User not authenticated");

	console.log("Storing tokens for user:", userId);
}
