import * as ZOHOCRMSDK from "@zohocrm/nodejs-sdk-2.1";

export class AuthenticationClient {
	private clientId: string;
	private clientSecret: string;
	private redirectUri: string;

	constructor({ clientId, clientSecret, redirectUri }) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectUri = redirectUri;

		// Initialize the SDK
		ZOHOCRMSDK.SDKConfigBuilder.initialize({
			clientId: this.clientId,
			clientSecret: this.clientSecret,
			redirectURL: this.redirectUri,
			accessType: "offline",
		});
	}

	generateAuthUrl(scopes: string[]) {
		return ZOHOCRMSDK.Initializer.generateAuthorizationURL(scopes);
	}

	async generateTokens(code: string) {
		const tokenResponse = await ZOHOCRMSDK.Initializer.generateToken(code);
		return {
			access_token: tokenResponse.getAccessToken(),
			refresh_token: tokenResponse.getRefreshToken(),
			expires_in: tokenResponse.getExpiresIn(),
		};
	}

	async refreshAccessToken(refreshToken: string) {
		const tokenResponse = await ZOHOCRMSDK.Initializer.refreshAccessToken(refreshToken);
		return {
			access_token: tokenResponse.getAccessToken(),
			expires_in: tokenResponse.getExpiresIn(),
		};
	}
}
