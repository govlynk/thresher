import { defineFunction } from "@aws-amplify/backend";
import { Secret } from "@aws-amplify/backend-shared";

// Define secrets
const zohoSecrets = {
	clientId: Secret.fromString("ZOHO_CLIENT_ID", "Zoho API Client ID"),
	clientSecret: Secret.fromString("ZOHO_CLIENT_SECRET", "Zoho API Client Secret"),
	refreshToken: Secret.fromString("ZOHO_REFRESH_TOKEN", "Zoho Refresh Token"),
};

export const zohoAuth = defineFunction({
	name: "zohoAuth",
	entry: "./index.js",
	runtime: "nodejs18.x",
	memory: 512,
	timeout: 30,
	environment: {
		REDIRECT_URI: "https://govlynk.com/auth/zoho/callback",
	},
	secrets: zohoSecrets,
});
