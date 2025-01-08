import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const usePastPerformanceStore = create((set, get) => ({
	entries: [],
	loading: false,
	error: null,

	// Fetch entries for a company
	fetchEntries: async (companyId) => {
		if (!companyId) {
			set({ error: "Company ID is required" });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.PastPerformance.list({
				filter: { companyId: { eq: companyId } },
			});

			set({
				entries: response.data || [],
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching past performance entries:", err);
			set({
				error: err.message || "Failed to fetch entries",
				loading: false,
			});
		}
	},

	// Add new entry
	addEntry: async (entryData) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.PastPerformance.create(entryData);

			set((state) => ({
				entries: [...state.entries, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error adding entry:", err);
			set({
				error: err.message || "Failed to add entry",
				loading: false,
			});
			throw err;
		}
	},

	// Update existing entry
	updateEntry: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.PastPerformance.update({
				id,
				...updates,
			});

			set((state) => ({
				entries: state.entries.map((entry) => (entry.id === id ? response.data : entry)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating entry:", err);
			set({
				error: err.message || "Failed to update entry",
				loading: false,
			});
			throw err;
		}
	},

	// Delete entry
	deleteEntry: async (id) => {
		set({ loading: true, error: null });
		try {
			await client.models.PastPerformance.delete({ id });

			set((state) => ({
				entries: state.entries.filter((entry) => entry.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error deleting entry:", err);
			set({
				error: err.message || "Failed to delete entry",
				loading: false,
			});
			throw err;
		}
	},

	// Reset store
	reset: () => {
		set({
			entries: [],
			loading: false,
			error: null,
		});
	},
}));
