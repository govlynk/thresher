// src/utils/userUtils.js
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export async function getUsersByCompany(companyId) {
	try {
		// First get all UserCompanyRoles for the company
		const userRolesResponse = await client.models.UserCompanyRole.list({
			filter: { companyId: { eq: companyId } },
		});

		if (!userRolesResponse?.data) {
			return [];
		}

		// Extract user IDs
		const userIds = userRolesResponse.data.map((role) => role.userId);

		// Fetch users with those IDs
		const usersPromises = userIds.map((userId) => client.models.User.get({ id: userId }));

		const userResponses = await Promise.all(usersPromises);

		// Filter out any null responses and map to user data
		return userResponses
			.filter((response) => response?.data)
			.map((response) => ({
				...response.data,
				companyRole: userRolesResponse.data.find((role) => role.userId === response.data.id),
			}));
	} catch (err) {
		console.error("Error fetching users by company:", err);
		throw err;
	}
}

export async function createUserWithCompanyRole(userData, companyId) {
	try {
		// Create user first
		const userResponse = await client.models.User.create(userData);

		if (!userResponse?.data) {
			throw new Error("Failed to create user");
		}

		// Create user-company association
		await client.models.UserCompanyRole.create({
			userId: userResponse.data.id,
			companyId: companyId,
			roleId: userData.roleId || "MEMBER",
			status: "ACTIVE",
		});

		return userResponse.data;
	} catch (err) {
		console.error("Error creating user with company role:", err);
		throw err;
	}
}

export async function deleteUserAndRoles(userId) {
	try {
		// Delete all user-company roles first
		const rolesResponse = await client.models.UserCompanyRole.list({
			filter: { userId: { eq: userId } },
		});

		if (rolesResponse?.data) {
			await Promise.all(rolesResponse.data.map((role) => client.models.UserCompanyRole.delete({ id: role.id })));
		}

		// Then delete the user
		await client.models.User.delete({ id: userId });
	} catch (err) {
		console.error("Error deleting user and roles:", err);
		throw err;
	}
}
