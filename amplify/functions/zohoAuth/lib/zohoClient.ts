import fetch from "node-fetch";

interface ZohoCountResponse {
	count: number;
}

export class AuthenticationClient {
	private clientId: string;
	private clientSecret: string;
	private redirectUri: string;

	constructor(config: { clientId: string; clientSecret: string; redirectUri: string }) {
		this.clientId = config.clientId;
		this.clientSecret = config.clientSecret;
		this.redirectUri = config.redirectUri;
	}

	generateAuthUrl(scopes: string[]): string {
		const scopeString = encodeURIComponent(scopes.join(","));
		const redirectUri = encodeURIComponent(this.redirectUri);
		return (
			`https://accounts.zoho.com/oauth/v2/auth?` +
			`scope=${scopeString}&client_id=${this.clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}`
		);
	}

	async exchangeCodeForTokens(code: string): Promise<any> {
		const params = new URLSearchParams({
			grant_type: "authorization_code",
			client_id: this.clientId,
			client_secret: this.clientSecret,
			redirect_uri: this.redirectUri,
			code,
		});

		const response = await fetch(`https://accounts.zoho.com/oauth/v2/token`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: params.toString(),
		});

		if (!response.ok) {
			throw new Error(`Token exchange failed: ${await response.text()}`);
		}

		return await response.json();
	}

	async getUserCount(accessToken: string): Promise<number> {
		const response = await fetch("https://www.zohoapis.com/crm/v2/users/count", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch user count: ${await response.text()}`);
		}

		const data = (await response.json()) as ZohoCountResponse;
		return data.count;
	}
}
