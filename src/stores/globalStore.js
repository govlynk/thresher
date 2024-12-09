import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGlobalStore = create(
	persist(
		(set, get) => ({
			// Active entities
			activeUserId: null,
			activeCompanyId: null,
			activeTeamId: null,

			// User methods
			setActiveUser: (userId) => {
				set({ activeUserId: userId });
			},

			getActiveUser: () => {
				return get().activeUserId;
			},

			// Company methods
			setActiveCompany: (companyId) => {
				set({
					activeCompanyId: companyId,
					// Reset team when company changes
					activeTeamId: null,
				});
			},

			getActiveCompany: () => {
				return get().activeCompanyId;
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
			}),
		}
	)
);
