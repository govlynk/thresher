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
			activeCompanyData: null,

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

					// Reset team selection when company changes
					set({
						activeCompanyId: companyId,
						activeCompanyData: companyData,
						activeTeamId: null, // Reset team selection
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
				console.log("Setting active team:", teamId);
				set({ activeTeamId: teamId });

				// Trigger a custom event to notify dependent components
				window.dispatchEvent(new CustomEvent("teamChanged", { detail: { teamId } }));
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
			partialize: (state) => ({
				activeUserId: state.activeUserId,
				activeCompanyId: state.activeCompanyId,
				activeTeamId: state.activeTeamId,
				activeCompanyData: state.activeCompanyData,
			}),
		}
	)
);
