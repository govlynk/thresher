import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useMaturityStore = create((set, get) => ({
	assessment: null,
	loading: false,
	error: null,

	fetchAssessment: async (companyId) => {
		if (!companyId) {
			throw new Error("Company ID is required");
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
			set({ error: err.message, loading: false });
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
					assessmentId: currentAssessment.id,
					companyId: data.companyId,
					answers: currentAssessment.answers,
					status: currentAssessment.status,
					completedAt: currentAssessment.completedAt,
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
			set({ error: err.message, loading: false });
			throw err;
		}
	},
}));
