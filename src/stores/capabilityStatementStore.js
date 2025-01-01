import { create } from "zustand";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export const useCapabilityStatementStore = create((set, get) => ({
	capabilityStatement: null,
	loading: false,
	error: null,
	lastFetchedCompanyId: null,

	fetchCapabilityStatement: async (companyId) => {
		// Don't fetch if already fetched for this company
		if (companyId === get().lastFetchedCompanyId) {
			return;
		}

		set({ loading: true, error: null });

		try {
			const response = await client.models.CapabilityStatement.get({
				companyId,
			});

			set({
				capabilityStatement: response?.data || null,
				loading: false,
				error: null,
				lastFetchedCompanyId: companyId,
			});

			return response?.data;
		} catch (err) {
			console.error("Error fetching capability statement:", err);
			set({
				error: err.message,
				loading: false,
				capabilityStatement: null,
			});
		}
	},

	saveCapabilityStatement: async (data) => {
		set({ loading: true, error: null });

		try {
			const existingStatement = get().capabilityStatement;
			const response = existingStatement
				? await client.models.CapabilityStatement.update({
						...data,
						id: existingStatement.id,
						_version: existingStatement._version,
				  })
				: await client.models.CapabilityStatement.create(data);

			if (!response?.data) {
				throw new Error("Failed to save capability statement");
			}

			set({
				capabilityStatement: response.data,
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

	reset: () => {
		set({
			capabilityStatement: null,
			loading: false,
			error: null,
			lastFetchedCompanyId: null,
		});
	},
}));
