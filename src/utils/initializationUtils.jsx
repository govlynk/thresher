import { generateClient } from "aws-amplify/data";

const client = generateClient();

export async function initializeUserData(userData) {
	console.log("[initializeUserData] Starting user initialization with:", userData);

	if (!userData?.id) {
		console.warn("[initializeUserData] No user ID found in userData");
		return null;
	}

	try {
		console.log("[initializeUserData] Setting active user ID:", userData.id);
		return userData.id;
	} catch (err) {
		console.error("[initializeUserData] Error initializing user data:", err);
		throw err;
	}
}

export async function initializeCompanyData(companies) {
	console.log("[initializeCompanyData] Starting company initialization with:", companies);

	if (!companies?.length) {
		console.warn("[initializeCompanyData] No companies found for user");
		return null;
	}

	try {
		const activeCompany = companies[0];
		console.log("[initializeCompanyData] Setting active company:", activeCompany);
		return activeCompany.id;
	} catch (err) {
		console.error("[initializeCompanyData] Error initializing company data:", err);
		throw err;
	}
}

export async function initializeTeamData(companyId) {
	console.log("[initializeTeamData] Starting team initialization for company:", companyId);

	if (!companyId) {
		console.warn("[initializeTeamData] No company ID provided");
		return null;
	}

	try {
		const teamsResponse = await client.models.Team.list({
			filter: { companyId: { eq: companyId } },
		});

		console.log("[initializeTeamData] Teams response:", teamsResponse);

		if (teamsResponse?.data?.length > 0) {
			const activeTeam = teamsResponse.data[0];
			console.log("[initializeTeamData] Setting active team:", activeTeam);
			return activeTeam.id;
		}

		return null;
	} catch (err) {
		console.error("[initializeTeamData] Error initializing team data:", err);
		throw err;
	}
}
