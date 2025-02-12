import { defineFunction, secret } from "@aws-amplify/backend";

export const getOpportunities = defineFunction({
	name: "getOpportunities",
	entry: "./src/handler.ts",
	environment: {
		HIGHER_GOV_API_KEY: secret("higher-gov-api-key"),
	},
	timeoutSeconds: 30,
	memoryMB: 1024, // Use memoryMB instead of runtime.memory
});
