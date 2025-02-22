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
		console.log("AuthenticationClient constructor:", {
			clientIdLength: clientId?.length,
			clientIdFirstChars: clientId?.substring(0, 8),
			hasSecret: !!clientSecret,
			redirectUri,
		});

		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectUri = redirectUri;
	}

	generateAuthUrl(scopes: string[]) {
		const scopeString = encodeURIComponent(scopes.join(","));
		const redirectUri = encodeURIComponent(this.redirectUri);

		const url =
			`https://accounts.zoho.com/oauth/v2/auth?` +
			`scope=${scopeString}&` +
			`client_id=${this.clientId}&` +
			`response_type=code&` +
			`access_type=offline&` +
			`redirect_uri=${redirectUri}`;

		console.log("Generated auth URL details:", {
			scopeString,
			encodedRedirectUri: redirectUri,
			clientIdUsed: this.clientId?.substring(0, 8),
			fullUrl: url,
		});

		return url;
	}

	async exchangeCodeForTokens(code: string, attempt = 1): Promise<TokenResponse> {
		try {
			const params = new URLSearchParams({
				grant_type: "authorization_code",
				client_id: this.clientId,
				client_secret: this.clientSecret,
				redirect_uri: this.redirectUri,
				access_type: "offline",
				code,
			});

			console.log("Token exchange request:", {
				url: `https://accounts.zoho.com/oauth/v2/token`,
				params: params.toString(),
				clientIdUsed: this.clientId?.substring(0, 8),
			});

			const response = await fetch(`https://accounts.zoho.com/oauth/v2/token?${params}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			console.log("Token exchange response:", {
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries(response.headers),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Token exchange error:", errorText);
				throw new Error(`Token exchange failed: ${response.statusText} - ${errorText}`);
			}

			const data = await response.json();
			console.log("Token exchange success:", {
				hasAccessToken: !!data.access_token,
				hasRefreshToken: !!data.refresh_token,
				expiresIn: data.expires_in,
			});

			return data;
		} catch (error) {
			console.error("Token exchange error:", error);
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
			console.log("***Refresh Response:", response);
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

	async getUserCount(accessToken: string): Promise<number> {
		try {
			const response = await fetch("https://www.zohoapis.com/crm/v2/users/count", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`CRM request failed: ${response.statusText} - ${errorText}`);
			}

			const data = await response.json();
			return data.count;
		} catch (error) {
			console.error("Error getting user count:", error);
			throw error;
		}
	}
}
