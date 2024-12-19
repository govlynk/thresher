import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useGlobalStore = create(
	persist(
		(set, get) => ({
			// Active entities
			activeUserId: null,
			activeCompanyId: null,
			activeTeamId: null,
			activeCompanyData: null, // Add this to store full company data

			// User methods
			setActiveUser: (userId) => {
				set({ activeUserId: userId });
			},

			getActiveUser: () => {
				return get().activeUserId;
			},

			// Company methods
			setActiveCompany: async (companyId) => {
				try {
					// Fetch full company data
					const response = await client.models.Company.get({ id: companyId });
					const companyData = response?.data;

					if (!companyData) {
						throw new Error("Company data not found");
					}

					set({
						activeCompanyId: companyId,
						activeCompanyData: companyData,
						// Reset team when company changes
						activeTeamId: null,
					});

					return companyData;
				} catch (err) {
					console.error("Error setting active company:", err);
					throw err;
				}
			},

			getActiveCompany: () => {
				const state = get();
				return state.activeCompanyData || null;
			},

			// Team methods
			setActiveTeam: (teamId) => {
				set({ activeTeamId: teamId });
			},

			getActiveTeam: () => {
				return get().activeTeamId;
			},

			// Reset all state
			reset: () => {
				set({
					activeUserId: null,
					activeCompanyId: null,
					activeTeamId: null,
					activeCompanyData: null,
				});
			},
		}),
		{
			name: "global-store",
			// Only persist these fields
			partialize: (state) => ({
				activeUserId: state.activeUserId,
				activeCompanyId: state.activeCompanyId,
				activeTeamId: state.activeTeamId,
				activeCompanyData: state.activeCompanyData,
			}),
		}
	)
);
