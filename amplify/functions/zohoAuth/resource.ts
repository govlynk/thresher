import { defineFunction, secret } from "@aws-amplify/backend";

export const zohoAuth = defineFunction({
	name: "zohoAuth",
	entry: "./handler.ts",
	runtime: 18,
	memoryMB: 2048,
	environment: {
		ZOHO_CLIENT_ID: secret("ZOHO_CLIENT_ID"),
		ZOHO_CLIENT_SECRET: secret("ZOHO_CLIENT_SECRET"),
		ZOHO_REFRESH_TOKEN: secret("ZOHO_REFRESH_TOKEN"),
	},
});
