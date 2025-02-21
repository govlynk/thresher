import { defineFunction, secret } from "@aws-amplify/backend";

export const samApi = defineFunction({
	name: "samApi",
	entry: "./src/handler.ts",
	environment: {
		SAM_API_KEY: secret("sam-api-key"),
	},
	timeoutSeconds: 30,
	memoryMB: 1024,
});
