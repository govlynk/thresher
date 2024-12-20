import { generateClient } from "aws-amplify/data";

const client = generateClient();

export async function getUsersByCompany(companyId) {
	try {
		const userRolesResponse = await client.models.UserCompanyAccess.list({
			filter: { companyId: { eq: companyId } },
		});

		if (!userRolesResponse?.data) {
			return [];
		}

		const userIds = userRolesResponse.data.map((role) => role.userId);
		const usersPromises = userIds.map((userId) => client.models.User.get({ id: userId }));
		const userResponses = await Promise.all(usersPromises);

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
		// Check if user already exists with this email
		const existingUsers = await client.models.User.list({
			filter: { email: { eq: userData.email } },
		});

		let user;
		if (existingUsers.data?.length > 0) {
			// Update existing user
			user = existingUsers.data[0];
			const updatedUser = await client.models.User.update({
				id: user.id,
				name: userData.name,
				phone: userData.phone,
				status: userData.status,
				lastLogin: new Date().toISOString(),
				contactId: userData.contactId, // Add contact association if provided
			});
			user = updatedUser.data;
		} else {
			// Create new user
			const newUser = await client.models.User.create({
				cognitoId: userData.cognitoId,
				email: userData.email,
				name: userData.name,
				phone: userData.phone,
				status: userData.status,
				lastLogin: new Date().toISOString(),
				contactId: userData.contactId, // Add contact association if provided
			});
			user = newUser.data;
		}

		// Check for existing company role
		const existingRole = await client.models.UserCompanyAccess.list({
			filter: {
				and: [{ userId: { eq: user.id } }, { companyId: { eq: companyId } }],
			},
		});

		// Create or update company role
		if (!existingRole.data?.length) {
			await client.models.UserCompanyAccess.create({
				userId: user.id,
				companyId: companyId,
				access: userData.accessLevel || "MEMBER",
				status: "ACTIVE",
			});
		}

		return user;
	} catch (err) {
		console.error("Error in createUserWithCompanyRole:", err);
		throw new Error(err.message || "Failed to create/update user");
	}
}

export async function deleteUserAndRoles(userId) {
	try {
		const rolesResponse = await client.models.UserCompanyAccess.list({
			filter: { userId: { eq: userId } },
		});

		if (rolesResponse?.data) {
			await Promise.all(rolesResponse.data.map((role) => client.models.UserCompanyAccess.delete({ id: role.id })));
		}

		await client.models.User.delete({ id: userId });
	} catch (err) {
		console.error("Error deleting user and roles:", err);
		throw err;
	}
}
