import * as ZOHOCRMSDK from "@zohocrm/nodejs-sdk-2.1";

interface TokenResponse {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	api_domain: string;
}

export class AuthenticationClient {
	private clientId: string;
	private clientSecret: string;
	private redirectUri: string;
	private retryAttempts = 5;
	private retryDelay = 1000;

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

	async exchangeCodeForTokens(code: string, attempt = 1): Promise<TokenResponse> {
		try {
			const params = new URLSearchParams({
				grant_type: "authorization_code",
				client_id: this.clientId,
				client_secret: this.clientSecret,
				redirect_uri: this.redirectUri,
				code,
			});

			const response = await fetch(`https://accounts.zoho.com/oauth/v2/token?${params}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			if (!response.ok) {
				throw new Error(`Token exchange failed: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			if (attempt < this.retryAttempts) {
				await new Promise((resolve) => setTimeout(resolve, this.retryDelay * Math.pow(2, attempt - 1)));
				return this.exchangeCodeForTokens(code, attempt + 1);
			}
			throw error;
		}
	}

	async refreshAccessToken(refreshToken: string, attempt = 1): Promise<TokenResponse> {
		try {
			const params = new URLSearchParams({
				grant_type: "refresh_token",
				client_id: this.clientId,
				client_secret: this.clientSecret,
				refresh_token: refreshToken,
			});

			const response = await fetch(`https://accounts.zoho.com/oauth/v2/token?${params}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			if (!response.ok) {
				throw new Error(`Token refresh failed: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			if (error.status === 429 && attempt < this.retryAttempts) {
				await new Promise((resolve) => setTimeout(resolve, this.retryDelay * Math.pow(2, attempt - 1)));
				return this.refreshAccessToken(refreshToken, attempt + 1);
			}
			throw error;
		}
	}
}
