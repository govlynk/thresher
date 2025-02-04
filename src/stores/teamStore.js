import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useTeamStore = create((set, get) => ({
	teams: [],
	loading: false,
	error: null,
	unlinkedUsers: [], // Track users without contact records
	subscription: null,

	fetchTeams: async (companyId) => {
		if (!companyId) {
			set({
				teams: [],
				loading: false,
				error: "Company ID is required",
			});
			return;
		}

		// Cleanup existing subscription
		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
		}

		set({ loading: true });
		try {
			// Set up subscription for real-time updates with unique operation ID
			const subscription = client.models.Team.observeQuery({
				filter: { companyId: { eq: companyId } },
			}).subscribe(async ({ items }) => {
				try {
					// Fetch members for each team
					const teamsWithMembers = await Promise.all(
						items.map(async (team) => {
							try {
								const membersResponse = await client.models.TeamMember.list({
									filter: { teamId: { eq: team.id } },
								});

								const membersWithContacts = await Promise.all(
									(membersResponse?.data || []).map(async (member) => {
										try {
											const contactResponse = await client.models.Contact.get({
												id: member.contactId,
											});

											// If no contact found, check if this is a GovLynk user
											if (!contactResponse?.data) {
												const userResponse = await client.models.User.get({
													id: member.userId,
												});

												if (userResponse?.data) {
													return {
														...member,
														isUnlinkedUser: true,
														contact: {
															id: null,
															firstName: userResponse.data.name.split(" ")[0],
															lastName: userResponse.data.name.split(" ")[1] || "",
															contactEmail: userResponse.data.email,
															isGovLynkUser: true,
														},
													};
												}
											}

											return {
												...member,
												contact: contactResponse?.data || null,
											};
										} catch (err) {
											console.warn(`Error fetching contact for member ${member.id}:`, err);
											return {
												...member,
												contact: null,
											};
										}
									})
								);

								return {
									...team,
									members: membersWithContacts,
								};
							} catch (err) {
								console.warn(`Error fetching members for team ${team.id}:`, err);
								return {
									...team,
									members: [],
								};
							}
						})
					);

					// Track unlinked users
					const unlinkedUsers = teamsWithMembers
						.flatMap((team) => team.members)
						.filter((member) => member?.isUnlinkedUser)
						.map((member) => ({
							userId: member.userId,
							name: `${member.contact.firstName} ${member.contact.lastName}`,
							email: member.contact.contactEmail,
						}));

					set({
						teams: teamsWithMembers,
						unlinkedUsers,
						loading: false,
						error: null,
					});
				} catch (err) {
					console.error("Error processing teams data:", err);
					set({
						error: err.message || "Failed to process teams data",
						loading: false,
					});
				}
			});

			set({ subscription });
		} catch (err) {
			console.error("Error fetching teams:", err);
			set({
				error: err.message || "Failed to fetch teams",
				loading: false,
			});
		}
	},

	addTeam: async (teamData) => {
		set({ loading: true, error: null });
		try {
			// Validate team data
			if (!teamData.name?.trim()) {
				throw new Error("Team name is required");
			}

			const response = await client.models.Team.create(teamData);
			set({ loading: false });
			return response.data;
		} catch (err) {
			console.error("Error creating team:", err);
			set({
				error: err.message || "Failed to create team",
				loading: false,
			});
			throw err;
		}
	},

	updateTeam: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			// Validate updates
			if (updates.name && !updates.name.trim()) {
				throw new Error("Team name cannot be empty");
			}

			const response = await client.models.Team.update({
				id,
				...updates,
			});
			set({ loading: false });
			return response.data;
		} catch (err) {
			console.error("Error updating team:", err);
			set({
				error: err.message || "Failed to update team",
				loading: false,
			});
			throw err;
		}
	},

	removeTeam: async (id) => {
		set({ loading: true, error: null });
		try {
			// First remove all team members
			const members = await client.models.TeamMember.list({
				filter: { teamId: { eq: id } },
			});

			await Promise.all(members.data.map((member) => client.models.TeamMember.delete({ id: member.id })));

			// Then delete the team
			await client.models.Team.delete({ id });
			set({ loading: false });
		} catch (err) {
			console.error("Error removing team:", err);
			set({
				error: err.message || "Failed to remove team",
				loading: false,
			});
			throw err;
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
		set({
			teams: [],
			unlinkedUsers: [],
			loading: false,
			error: null,
			subscription: null,
		});
	},
}));
