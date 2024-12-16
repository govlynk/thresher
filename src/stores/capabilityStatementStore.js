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
	history: [],

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
			console.log(response);
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
		if (!activeCompanyId) {
			set({ error: "No active company selected" });
			return;
		}
		console.log("+++saving capability data", data);
		set({ loading: true, error: null });
		try {
			const response = await client.models.CapabilityStatement.create({
				aboutUs: data.aboutUs,
				keyCapabilities: data.keyCapabilities,
				competitiveAdvantage: data.competitiveAdvantage,
				mission: data.mission,
				vision: data.vision,
				keywords: data.keywords,
				lastModified: new Date().toISOString(),
				companyId: activeCompanyId,
			});
			console.log(response);
			set({
				statement: response?.data || null,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error saving capability statement:", err);
			set({ error: err.message, loading: false });
		}
	},
}));
