import { fetchAuthSession } from "aws-amplify/auth";

export async function getAuthSession() {
	const session = await fetchAuthSession();
	if (!session.tokens?.accessToken) {
		throw new Error("Invalid session");
	}
	return session;
}

export function extractUserGroups(session) {
	const groups = session.tokens.accessToken.payload["cognito:groups"] || [];
	return {
		groups,
		isAdmin: groups.includes("ADMIN"),
		isGovLynk: groups.includes("GOVLYNK"),
		isGovLynkAdmin: groups.includes("GOVLYNK_ADMIN"),
	};
}
