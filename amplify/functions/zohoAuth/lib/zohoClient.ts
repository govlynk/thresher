import * as ZOHOCRMSDK from "@zohocrm/nodejs-sdk-2.1";

export class AuthenticationClient {
	private clientId: string;
	private clientSecret: string;
	private refreshToken: string;

	constructor({ clientId, clientSecret, refreshToken }) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.refreshToken = refreshToken;
	}

	async initialize() {
		const environment = ZOHOCRMSDK.USDataCenter.PRODUCTION();
		const tokenParams = {
			clientId: this.clientId,
			clientSecret: this.clientSecret,
			refreshToken: this.refreshToken,
		};

		await ZOHOCRMSDK.InitializeBuilder().environment(environment).token(tokenParams).initialize();

		return ZOHOCRMSDK.TokenStore.getToken();
	}

	async getAccessToken() {
		const token = await this.initialize();
		return {
			access_token: token.getAccessToken(),
			expires_in: token.getExpiresIn(),
		};
	}
}
