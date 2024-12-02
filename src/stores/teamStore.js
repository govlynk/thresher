import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useTeamStore = create((set, get) => ({
	teams: [],
	loading: false,
	error: null,

	fetchTeams: async (companyId) => {
		if (!companyId) {
			set({
				teams: [],
				loading: false,
				error: "Company ID is required",
			});
			return;
		}

		console.log("TeamStore: Starting fetchTeams for companyId:", companyId);
		set({ loading: true });
		try {
			const { data: teams } = await client.models.Team.list({
				filter: { companyId: { eq: companyId } },
			});

			if (!teams) {
				throw new Error("Failed to fetch teams");
			}

			// Fetch members for each team
			const teamsWithMembers = await Promise.all(
				teams.map(async (team) => {
					const { data: members } = await client.models.TeamMember.list({
						filter: { teamId: { eq: team.id } },
						include: {
							contact: true,
						},
					});
					return {
						...team,
						members: members || [],
					};
				})
			);

			console.log("TeamStore: Teams with members:", teamsWithMembers);

			set({
				teams: teamsWithMembers,
				loading: false,
				error: null,
			});

			return teamsWithMembers;
		} catch (err) {
			console.error("TeamStore: Error fetching teams:", err);
			set({
				error: err.message || "Failed to fetch teams",
				loading: false,
				teams: [],
			});
			throw err;
		}
	},

	addTeam: async (teamData) => {
		// Validate required fields
		if (!teamData.companyId) {
			console.error("TeamStore: addTeam called without companyId");
			throw new Error("Company ID is required");
		}

		if (!teamData.name?.trim()) {
			console.error("TeamStore: addTeam called without name");
			throw new Error("Team name is required");
		}

		set({ loading: true });
		try {
			const response = await client.models.Team.create({
				name: teamData.name.trim(),
				description: teamData.description?.trim() || null,
				companyId: teamData.companyId,
			});

			if (!response?.data) {
				throw new Error("Failed to create team");
			}

			console.log("TeamStore: Successfully created team:", response.data);
			set((state) => ({
				teams: [...state.teams, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("TeamStore: Error creating team:", err);
			set({
				error: err.message || "Failed to create team",
				loading: false,
			});
			throw err;
		}
	},

	updateTeam: async (id, teamData) => {
		if (!id) {
			console.error("TeamStore: updateTeam called without id");
			throw new Error("Team ID is required");
		}

		set({ loading: true });
		try {
			const response = await client.models.Team.update({
				id,
				name: teamData.name?.trim(),
				description: teamData.description?.trim() || null,
			});

			if (!response?.data) {
				throw new Error("Failed to update team");
			}

			console.log("TeamStore: Successfully updated team:", response.data);
			set((state) => ({
				teams: state.teams.map((team) => (team.id === id ? response.data : team)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("TeamStore: Error updating team:", err);
			set({
				error: err.message || "Failed to update team",
				loading: false,
			});
			throw err;
		}
	},

	removeTeam: async (id) => {
		if (!id) {
			console.error("TeamStore: removeTeam called without id");
			throw new Error("Team ID is required");
		}

		set({ loading: true });
		try {
			// First remove all team members
			const teamMembers = await client.models.TeamMember.list({
				filter: { teamId: { eq: id } },
			});

			if (teamMembers?.data) {
				for (const member of teamMembers.data) {
					await client.models.TeamMember.delete({ id: member.id });
				}
			}

			// Then remove the team
			await client.models.Team.delete({ id });

			console.log("TeamStore: Successfully removed team and its members");
			set((state) => ({
				teams: state.teams.filter((team) => team.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("TeamStore: Error removing team:", err);
			set({
				error: err.message || "Failed to delete team",
				loading: false,
			});
			throw err;
		}
	},

	clearStore: () => {
		console.log("TeamStore: Clearing store state");
		set({
			teams: [],
			loading: false,
			error: null,
		});
	},
}));
