export const defineConfig = () => ({
	name: "zohoAuth",
	runtime: "nodejs18.x",
	timeout: 30,
	memorySize: 512,
	environment: {
		REDIRECT_URI: "https://govlynk.com/auth/zoho/callback",
		// Don't store the refresh token here - use AWS Secrets Manager instead
	},
});
