import { generateClient } from "aws-amplify/api";

const client = generateClient();

export async function getZohoAccessToken() {
	try {
		const response = await client.graphql({
			query: `query RefreshZohoTokens {
        refreshZohoTokens {
          access_token
          expires_in
        }
      }`,
		});

		return response.data.refreshZohoTokens.access_token;
	} catch (error) {
		console.error("Error refreshing Zoho token:", error);
		throw error;
	}
}
