import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useTeamMemberStore = create((set) => ({
	teamMembers: [],
	loading: false,
	error: null,
	subscription: null,

	addTeamMember: async ({ teamId, contactId, role, isGovLynkUser, workload = 100 }) => {
		console.log("TeamMemberStore: Adding member with data:", { teamId, contactId, role, isGovLynkUser, workload });
		if (!teamId || !contactId || !role) {
			console.error("TeamMemberStore: addTeamMember called with incomplete data", {
				teamId,
				contactId,
				role,
				isGovLynkUser,
				workload,
			});
			throw new Error("Team ID, Contact ID, and Role are required");
		}

		set({ loading: true });
		try {
			// Check if member already exists
			const existingMember = await client.models.TeamMember.list({
				filter: {
					and: [{ teamId: { eq: teamId } }, { contactId: { eq: contactId } }],
				},
			});

			if (existingMember.data?.length > 0) {
				throw new Error("This member is already part of the team");
			}

			let memberData = {
				teamId,
				contactId,
				role: role || "Consultant", // Default role if none provided
				workload,
				isGovLynkUser: isGovLynkUser || false,
			};

			const response = await client.models.TeamMember.create(memberData);
			console.log("TeamMemberStore: after creat call:", response);
			if (!response?.data) {
				throw new Error(`Failed to add ${isGovLynkUser ? "GovLynk" : ""} team member`);
			}

			console.log("TeamMemberStore: Successfully added team member:", response.data);
			set((state) => ({
				teamMembers: [...state.teamMembers, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("TeamMemberStore: Error adding team member:", err);
			set({
				error: err.message || "Failed to add team member",
				loading: false,
			});
			throw err;
		}
	},

	updateTeamMember: async (id, updates) => {
		if (!id) {
			throw new Error("Team member ID is required");
		}

		set({ loading: true });
		try {
			const response = await client.models.TeamMember.update({
				id,
				...updates,
			});

			set((state) => ({
				teamMembers: state.teamMembers.map((member) => (member.id === id ? response.data : member)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating team member:", err);
			set({
				error: err.message || "Failed to update team member",
				loading: false,
			});
			throw err;
		}
	},

	removeTeamMember: async (id) => {
		if (!id) {
			throw new Error("Team member ID is required");
		}

		set({ loading: true });
		try {
			await client.models.TeamMember.delete({ id });

			set((state) => ({
				teamMembers: state.teamMembers.filter((member) => member.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing team member:", err);
			set({
				error: err.message || "Failed to remove team member",
				loading: false,
			});
			throw err;
		}
	},
}));
