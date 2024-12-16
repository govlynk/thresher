import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";

const client = generateClient({
	authMode: "userPool",
});

export const usePastPerformanceStore = create((set) => ({
	performances: [],
	loading: false,
	error: null,

	fetchPerformances: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			set({ error: "No active company selected" });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.PastPerformance.list({
				filter: { companyId: { eq: activeCompanyId } },
			});

			set({
				performances: response?.data || [],
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching past performances:", err);
			set({ error: err.message, loading: false });
		}
	},

	savePerformance: async (data) => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			const response = data.id
				? await client.models.PastPerformance.update({
						id: data.id,
						...data,
						companyId: activeCompanyId,
				  })
				: await client.models.PastPerformance.create({
						...data,
						companyId: activeCompanyId,
				  });

			set((state) => ({
				performances: data.id
					? state.performances.map((p) => (p.id === data.id ? response.data : p))
					: [...state.performances, response.data],
				loading: false,
				error: null,
			}));
			return response.data;
		} catch (err) {
			console.error("Error saving past performance:", err);
			set({ error: err.message, loading: false });
			throw err;
		}
	},

	reset: () =>
		set({
			performances: [],
			loading: false,
			error: null,
		}),
}));
