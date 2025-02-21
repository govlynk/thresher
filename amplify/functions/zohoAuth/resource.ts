import { defineFunction, type FunctionResources } from "@aws-amplify/backend";

export const zohoAuth = defineFunction({
	name: "zohoAuth",
	entry: "./handler.ts",
	runtime: 18,
	memory: 512,
	timeout: 30,
	environment: {
		REDIRECT_URI: "https://govlynk.com/auth/zoho/callback",
	},
	secrets: {
		ZOHO_CLIENT_ID: "Zoho API Client ID",
		ZOHO_CLIENT_SECRET: "Zoho API Client Secret",
		ZOHO_REFRESH_TOKEN: "Zoho Refresh Token",
	},
}) satisfies FunctionResources;
