import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useMaturityStore = create((set, get) => ({
	assessment: null,
	assessments: [],
	loading: false,
	error: null,

	fetchAssessment: async (companyId) => {
		console.log("[MaturityStore] Fetching assessment for company:", companyId);
		if (!companyId) {
			console.error("[MaturityStore] No company ID provided");
			throw new Error("Company ID is required");
		}

		set({ loading: true, error: null });
		try {
			// Fetch all assessments for the company, sorted by date
			const response = await client.models.MaturityAssessment.list({
				filter: { companyId: { eq: companyId } },
				sort: { field: "createdAt", direction: "DESC" },
			});

			console.log("[MaturityStore] List response:", response);

			const assessments = response?.data || [];

			set({
				assessments,
				assessment: assessments[0] || null, // Set most recent as current
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("[MaturityStore] Error fetching assessment:", {
				error: err,
				message: err.message,
				stack: err.stack,
			});
			set({ error: err.message, loading: false });
		}
	},

	saveAssessment: async (data) => {
		console.log("[MaturityStore] Starting saveAssessment with data:", data);

		if (!data.companyId) {
			console.error("[MaturityStore] No company ID in save data");
			throw new Error("Company ID is required");
		}

		set({ loading: true, error: null });
		try {
			const timestamp = new Date().toISOString();

			// Create new assessment
			const response = await client.models.MaturityAssessment.create({
				companyId: data.companyId,
				answers: JSON.stringify(data.answers),
				status: data.status || "IN_PROGRESS",
				completedAt: data.completedAt || null,
				lastModified: timestamp,
			});

			if (!response?.data) {
				throw new Error("No response received from API");
			}

			// Update store state
			set((state) => ({
				assessment: response.data,
				assessments: [response.data, ...state.assessments],
				loading: false,
				error: null,
			}));

			console.log("[MaturityStore] Successfully saved assessment:", response.data);
			return response.data;
		} catch (err) {
			console.error("[MaturityStore] Error saving assessment:", err);
			set({
				error: `Failed to save assessment: ${err.message}`,
				loading: false,
			});
			throw err;
		}
	},

	selectAssessment: (assessmentId) => {
		const assessment = get().assessments.find((a) => a.id === assessmentId);
		if (assessment) {
			set({ assessment });
		}
	},

	reset: () => {
		console.log("[MaturityStore] Resetting store state");
		set({
			assessment: null,
			assessments: [],
			loading: false,
			error: null,
		});
	},
}));
