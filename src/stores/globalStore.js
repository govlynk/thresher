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
				console.log("setActiveCompany called with:", companyId);
				try {
					const response = await client.models.Company.get({ id: companyId });
					console.log("Company data response:", response);
					const companyData = response?.data;

					if (!companyData) {
						console.error("No company data found for ID:", companyId);
						throw new Error("Company data not found");
					}

					console.log("Setting active company:", {
						companyId,
						companyData,
					});

					set({
						activeCompanyId: companyId,
						activeCompanyData: companyData,
					});

					return companyData;
				} catch (err) {
					console.error("Error setting active company:", err);
					throw err;
				}
			},

			getActiveCompany: () => {
				const state = get();
				console.log("getActiveCompany called, current state:", {
					activeCompanyId: state.activeCompanyId,
					activeCompanyData: state.activeCompanyData,
				});
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
