import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";
import { useLogger } from "../hooks/useLogger";

const client = generateClient({
	authMode: "userPool",
});

export const useCapabilityStatementStore = create((set, get) => {
	const logger = useLogger("CapabilityStatementStore");

	return {
		statement: null,
		loading: false,
		error: null,

		fetchCapabilityStatement: async () => {
			const { activeCompanyId } = useGlobalStore.getState();
			if (!activeCompanyId) {
				logger.error("No active company selected");
				set({ error: "No active company selected" });
				return;
			}

			set({ loading: true, error: null });
			try {
				logger.debug("Fetching capability statement for company:", activeCompanyId);
				const response = await client.models.CapabilityStatement.list({
					filter: { companyId: { eq: activeCompanyId } },
					limit: 1,
				});

				set({
					statement: response?.data?.[0] || null,
					loading: false,
					error: null,
				});
				logger.debug("Fetched capability statement:", response?.data?.[0]);
			} catch (err) {
				logger.error("Error fetching capability statement:", err);
				set({ error: err.message, loading: false });
			}
		},

		saveCapabilityStatement: async (data) => {
			const { activeCompanyId } = useGlobalStore.getState();
			const currentStatement = get().statement;

			if (!activeCompanyId) {
				logger.error("No active company selected");
				throw new Error("No active company selected");
			}

			set({ loading: true, error: null });
			try {
				// Extract only the core capability fields
				const capabilityData = {
					companyId: activeCompanyId,
					aboutUs: data.aboutUs?.trim() || null,
					keyCapabilities: Array.isArray(data.keyCapabilities) ? data.keyCapabilities : [],
					competitiveAdvantage: data.competitiveAdvantage?.trim() || null,
					mission: data.mission?.trim() || null,
					vision: data.vision?.trim() || null,
					lastModified: new Date().toISOString(),
				};

				logger.debug("Saving capability statement with data:", capabilityData);

				let response;
				if (currentStatement?.id) {
					// Update existing statement
					response = await client.models.CapabilityStatement.update({
						id: currentStatement.id,
						...capabilityData,
					});
					logger.debug("Updated existing capability statement");
				} else {
					// Create new statement
					response = await client.models.CapabilityStatement.create(capabilityData);
					logger.debug("Created new capability statement");
				}

				if (!response?.data) {
					throw new Error("Failed to save capability statement - invalid response");
				}

				set({
					statement: response.data,
					loading: false,
					error: null,
				});

				return response.data;
			} catch (err) {
				logger.error("Error saving capability statement:", err);
				set({ error: err.message, loading: false });
				throw err;
			}
		},

		reset: () => {
			logger.debug("Resetting capability statement store");
			set({
				statement: null,
				loading: false,
				error: null,
			});
		},
	};
});
