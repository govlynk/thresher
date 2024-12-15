import { generateClient } from "aws-amplify/data";
import { useState } from "react";
import {
	initializeCompanyData,
	initializeContactData,
	initializeUserData,
	initializeTeamData,
	initializeTeamMemberData,
	initializeUserCompanyAccess,
} from "./setupUtils";

const client = generateClient({
	authMode: "userPool",
});

// Main setup function that orchestrates the entire setup process
export async function setupCompany({ companyData, contactsData, adminData, teamData }) {
	try {
		// 1. Create company
		const company = await createCompany(companyData);
		console.log("Created company:", company);

		// 2. Create contacts
		const contacts = await createContacts(contactsData, company.id);
		console.log("Created contacts:", contacts);

		// 3. Create team
		const team = await createTeam(teamData, company.id);
		console.log("Created team:", team);

		// 4. Create admin users and their associations
		const adminUsers = await Promise.all(
			adminData.map(async (admin) => {
				// Create user
				const user = await createUser({
					cognitoId: admin.cognitoId,
					email: admin.email,
					name: `${admin.firstName} ${admin.lastName}`,
					phone: admin.phone,
					contactId: contacts.find((c) => c.email === admin.email || c.contactEmail === admin.email).id,
					status: "ACTIVE",
				});

				// Create user-company access
				await createUserCompanyAccess(user.id, company.id, admin.accessLevel);

				// Create team member entry
				const contact = contacts.find((c) => c.email === admin.email || c.contactEmail === admin.email);
				if (contact) {
					await createTeamMember(contact.id, team.id, contact.role);
				}

				return user;
			})
		);
		console.log("Created admin users:", adminUsers);

		// 5. Create team members for remaining contacts
		const remainingContacts = contacts.filter(
			(contact) => !adminUsers.some((user) => user.email === contact.email || user.email === contact.contactEmail)
		);

		await Promise.all(
			remainingContacts.map((contact) => createTeamMember(contact.id, team.id, contact.role || "Other"))
		);

		return {
			company,
			contacts,
			team,
			adminUsers,
		};
	} catch (error) {
		console.error("Setup error:", error);
		throw new Error(`Failed to complete setup: ${error.message}`);
	}
}

// Helper functions for individual entity creation
async function createCompany(companyData) {
	const initializedData = initializeCompanyData(companyData);

	const response = await client.models.Company.create(initializedData);
	console.log("******company****", response);
	if (!response?.data?.id) throw new Error("Failed to create company");
	return response.data;
}

async function createContacts(contacts, companyId) {
	const contactPromises = contacts.map((contact) => {
		const initializedContact = initializeContactData({
			...contact,
			companyId,
		});
		return client.models.Contact.create(initializedContact);
	});

	const responses = await Promise.all(contactPromises);
	console.log("******contacts****", responses);
	return responses.map((response) => response.data);
}

async function createTeam(teamData, companyId) {
	const initializedTeam = initializeTeamData(teamData, companyId);
	const response = await client.models.Team.create(initializedTeam);
	console.log("******team****", response);
	if (!response?.data?.id) throw new Error("Failed to create team");
	return response.data;
}

async function createUser(userData, contacts) {
	const initializedUser = initializeUserData(userData);
	const response = await client.models.User.create(initializedUser);
	console.log("******user****", response);
	if (!response?.data?.id) throw new Error("Failed to create user");
	return response.data;
}

async function createUserCompanyAccess(userId, companyId, access) {
	const accessData = initializeUserCompanyAccess(userId, companyId, access);
	const response = await client.models.UserCompanyAccess.create(accessData);
	if (!response?.data?.id) throw new Error("Failed to create user company access");
	return response.data;
}

async function createTeamMember(contactId, teamId, role) {
	const memberData = initializeTeamMemberData(contactId, teamId, role);
	const response = await client.models.TeamMember.create(memberData);
	console.log("******team member****", response);
	if (!response?.data?.id) throw new Error("Failed to create team member");
	return response.data;
}
