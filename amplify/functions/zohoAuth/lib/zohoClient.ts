import * as ZOHOCRMSDK from "@zohocrm/nodejs-sdk-2.1";

export class AuthenticationClient {
	private clientId: string;
	private clientSecret: string;
	private redirectUri: string;

	constructor({ clientId, clientSecret, redirectUri }) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectUri = redirectUri;
	}

	generateAuthUrl(scopes: string[]) {
		const scopeString = encodeURIComponent(scopes.join(","));
		const redirectUri = encodeURIComponent(this.redirectUri);

		return (
			`https://accounts.zoho.com/oauth/v2/auth?` +
			`scope=${scopeString}&` +
			`client_id=${this.clientId}&` +
			`response_type=code&` +
			`access_type=offline&` +
			`redirect_uri=${redirectUri}`
		);
	}

	async generateTokens(code: string) {
		const environment = ZOHOCRMSDK.USDataCenter.PRODUCTION();
		const tokenParams = {
			clientId: this.clientId,
			clientSecret: this.clientSecret,
			redirectURL: this.redirectUri,
			grantToken: code,
		};

		await ZOHOCRMSDK.InitializeBuilder().environment(environment).token(tokenParams).initialize();

		const token = await ZOHOCRMSDK.TokenStore.getToken();

		return {
			access_token: token.getAccessToken(),
			refresh_token: token.getRefreshToken(),
			expires_in: token.getExpiresIn(),
		};
	}

	async refreshAccessToken(refreshToken: string) {
		const environment = ZOHOCRMSDK.USDataCenter.PRODUCTION();
		const tokenParams = {
			clientId: this.clientId,
			clientSecret: this.clientSecret,
			refreshToken: refreshToken,
		};

		await ZOHOCRMSDK.InitializeBuilder().environment(environment).token(tokenParams).initialize();

		const token = await ZOHOCRMSDK.TokenStore.getToken();

		return {
			access_token: token.getAccessToken(),
			expires_in: token.getExpiresIn(),
		};
	}
}
