import { generateClient } from "aws-amplify/data";

const client = generateClient();

export async function initializeUserData(userData) {
	if (!userData?.id) {
		return null;
	}

	try {
		return userData.id;
	} catch (err) {
		throw err;
	}
}

export async function initializeCompanyData(companies) {
	if (!companies?.length) {
		console.warn("[initializeCompanyData] No companies found for user");
		return null;
	}

	try {
		const activeCompany = companies[0];
		return activeCompany.id;
	} catch (err) {
		console.error("[initializeCompanyData] Error initializing company data:", err);
		throw err;
	}
}

export async function initializeTeamData(companyId) {
	if (!companyId) {
		console.warn("[initializeTeamData] No company ID provided");
		return null;
	}

	try {
		const teamsResponse = await client.models.Team.list({
			filter: { companyId: { eq: companyId } },
		});

		if (teamsResponse?.data?.length > 0) {
			const activeTeam = teamsResponse.data[0];
			return activeTeam.id;
		}

		return null;
	} catch (err) {
		console.error("[initializeTeamData] Error initializing team data:", err);
		throw err;
	}
}
