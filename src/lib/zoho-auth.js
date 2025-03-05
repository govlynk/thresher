import { generateClient } from "aws-amplify/api";

const client = generateClient();

export async function getZohoAccessToken() {
	try {
		const response = await client.graphql({
			query: `query RefreshZohoTokens {
        refreshZohoTokens {
          accessToken
          expiresAt
        }
      }`,
		});

		return response.data.refreshZohoTokens.accessToken;
	} catch (error) {
		console.error("Error refreshing Zoho token:", error);
		throw error;
	}
}
