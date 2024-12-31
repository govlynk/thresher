import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
}); // Initialize the client with proper auth mode

export const useMaturityStore = create((set, get) => ({
	assessment: null,
	history: [],
	loading: false,
	error: null,

	fetchAssessment: async (companyId) => {
		if (!companyId) {
			set({ error: "Company ID is required", loading: false });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.MaturityAssessment.list({
				filter: { companyId: { eq: companyId } },
				sort: { field: "createdAt", direction: "DESC" },
				limit: 1,
			});

			set({
				assessment: response?.data?.[0] || null,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching assessment:", err);
			set({ error: err.message || "Failed to fetch assessment", loading: false });
		}
	},

	saveAssessment: async (data) => {
		if (!data.companyId) {
			throw new Error("Company ID is required");
		}

		set({ loading: true, error: null });
		try {
			const currentAssessment = get().assessment;
			const timestamp = new Date().toISOString();

			// Save current version to history if it exists
			if (currentAssessment) {
				await client.models.MaturityAssessmentHistory.create({
					...currentAssessment,
					assessmentId: currentAssessment.id,
					modifiedAt: timestamp,
				});

				// Update existing assessment
				const response = await client.models.MaturityAssessment.update({
					id: currentAssessment.id,
					...data,
					lastModified: timestamp,
				});

				set({
					assessment: response.data,
					loading: false,
					error: null,
				});
			} else {
				// Create new assessment
				const response = await client.models.MaturityAssessment.create({
					...data,
					lastModified: timestamp,
				});

				set({
					assessment: response.data,
					loading: false,
					error: null,
				});
			}
		} catch (err) {
			console.error("Error saving assessment:", err);
			set({ error: err.message || "Failed to save assessment", loading: false });
			throw err;
		}
	},

	fetchHistory: async () => {
		const assessment = get().assessment;
		if (!assessment?.id) return;

		set({ loading: true });
		try {
			const response = await client.models.MaturityAssessmentHistory.list({
				filter: { assessmentId: { eq: assessment.id } },
				sort: { field: "modifiedAt", direction: "DESC" },
			});

			set({
				history: response?.data || [],
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching history:", err);
			set({ error: err.message || "Failed to fetch history", loading: false });
		}
	},
}));
