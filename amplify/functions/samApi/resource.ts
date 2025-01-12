import { defineFunction, secret } from "@aws-amplify/backend";

export const samApi = defineFunction({
	name: "samApi",
	environment: {
		SAM_API_KEY: secret("l5nES3FOs2N3Z1Uzd2IYck2eQn6xETUyfGnNPoEl"),
	},
	entry: "./handler.ts",
});
