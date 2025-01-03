import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const strategicPositioningStore = create((set, get) => ({
	capabilityStatement: null,
	loading: false,
	error: null,
	history: [],

	fetchCapabilityStatement: async (activeCompanyId) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.CapabilityStatement.list({
				filter: { companyId: { eq: activeCompanyId } },
				limit: 1,
			});
			console.log("response", response);
			set({
				capabilityStatement: response?.data?.[0] || null,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching strategic positioing:", err);
			set({ error: err.message, loading: false });
		}
	},

	saveCapabilityStatement: async (data) => {
		set({ loading: true, error: null });
		try {
			const currentStatement = get().capabilityStatement;
			const timestamp = new Date().toISOString();

			// Save current version to history if it exists
			if (currentStatement) {
				await client.models.CapabilityStatementHistory.create({
					...currentStatement,
					statementId: currentStatement.id,
					modifiedAt: timestamp,
				});

				// Update existing statement
				const response = await client.models.CapabilityStatement.update({
					id: currentStatement.id,
					...data,
					companyId: activeCompanyId,
					lastModified: timestamp,
				});

				set({
					capabilityStatement: response.data,
					loading: false,
					error: null,
				});
			} else {
				// Create new statement
				const response = await client.models.CapabilityStatement.create({
					...data,
					companyId: activeCompanyId,
					lastModified: timestamp,
				});

				set({
					capabilityStatement: response.data,
					loading: false,
					error: null,
				});
			}
		} catch (err) {
			console.error("Error saving capability statement:", err);
			set({ error: err.message, loading: false });
			throw err;
		}
	},

	reset: () => {
		set({
			capabilityStatement: null,
			loading: false,
			error: null,
		});
	},
}));
