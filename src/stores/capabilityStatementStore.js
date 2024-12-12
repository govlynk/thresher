import { create } from "zustand";
import { useGlobalStore } from "./globalStore";
import client from "../utils/amplifyClient";

export const useCapabilityStatementStore = create((set, get) => ({
	statement: null,
	loading: false,
	error: null,
	history: [],

	fetchStatement: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			set({ error: "No active company selected" });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.CapabilityStatement.list({
				filter: { companyId: { eq: activeCompanyId } },
				limit: 1,
			});

			set({
				statement: response?.data?.[0] || null,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching capability statement:", err);
			set({ error: err.message, loading: false });
		}
	},

	saveStatement: async (data) => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			const timestamp = new Date().toISOString();
			const currentStatement = get().statement;

			let response;
			if (currentStatement?.id) {
				// Save current version to history
				await client.models.CapabilityStatementHistory.create({
					...currentStatement,
					statementId: currentStatement.id,
					modifiedAt: timestamp,
				});

				// Update existing statement
				response = await client.models.CapabilityStatement.update({
					id: currentStatement.id,
					...data,
					companyId: activeCompanyId,
					lastModified: timestamp,
				});
			} else {
				// Create new statement
				response = await client.models.CapabilityStatement.create({
					...data,
					companyId: activeCompanyId,
					lastModified: timestamp,
				});
			}

			set({
				statement: response.data,
				loading: false,
				error: null,
			});
			return response.data;
		} catch (err) {
			console.error("Error saving capability statement:", err);
			set({ error: err.message, loading: false });
			throw err;
		}
	},

	fetchHistory: async () => {
		const statement = get().statement;
		if (!statement?.id) return;

		set({ loading: true });
		try {
			const response = await client.models.CapabilityStatementHistory.list({
				filter: { statementId: { eq: statement.id } },
				sort: { field: "modifiedAt", direction: "DESC" },
			});

			set({
				history: response?.data || [],
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching history:", err);
			set({ error: err.message, loading: false });
		}
	},

	reset: () =>
		set({
			statement: null,
			loading: false,
			error: null,
			history: [],
		}),
}));
