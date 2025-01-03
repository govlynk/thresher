import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { processAssessmentData } from "../utils/maturity/dataProcessing";

const client = generateClient({
	authMode: "userPool",
});

export const useMaturityStore = create((set, get) => ({
	assessment: null,
	assessments: [],
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
			});

			const assessments = response?.data || [];

			set({
				assessments,
				assessment: assessments[0] || null,
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
			const timestamp = new Date().toISOString();

			// Process assessment data
			const processedData = processAssessmentData(
				data.answers,
				data.title || `Maturity Assessment - ${new Date().toLocaleDateString()}`
			);

			if (!processedData) {
				throw new Error("Failed to process assessment data");
			}

			// Create assessment record
			const response = await client.models.MaturityAssessment.create({
				companyId: data.companyId,
				title: processedData.title,
				answers: JSON.stringify(data.answers),
				maturityScore: JSON.stringify({
					sections: processedData.sections,
					radarChartData: processedData.radarChartData,
					overallScore: processedData.overallScore,
				}),
				status: data.status || "IN_PROGRESS",
				completedAt: data.completedAt || null,
				lastModified: timestamp,
			});

			if (!response?.data) {
				throw new Error("Failed to save assessment");
			}

			set((state) => ({
				assessment: response.data,
				assessments: [response.data, ...state.assessments],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error saving assessment:", err);
			set({
				error: err.message || "Failed to save assessment",
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
		set({
			assessment: null,
			assessments: [],
			loading: false,
			error: null,
		});
	},
}));
