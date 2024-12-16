import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";

const client = generateClient({
	authMode: "userPool",
});

export const useCapabilityStatementStore = create((set, get) => ({
	statement: null,
	loading: false,
	error: null,

	fetchCapabilityStatement: async () => {
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

	saveCapabilityStatement: async (data) => {
		const { activeCompanyId } = useGlobalStore.getState();
		const currentStatement = get().statement;

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			let response;
			const statementData = {
				...data,
				companyId: activeCompanyId,
				lastModified: new Date().toISOString(),
			};

			if (currentStatement?.id) {
				// Update existing statement
				response = await client.models.CapabilityStatement.update({
					id: currentStatement.id,
					...statementData,
				});
			} else {
				// Create new statement
				response = await client.models.CapabilityStatement.create(statementData);
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

	reset: () =>
		set({
			statement: null,
			loading: false,
			error: null,
		}),
}));
