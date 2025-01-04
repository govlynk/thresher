import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { processAssessmentData } from "../utils/maturity/dataProcessing";

const client = generateClient({
	authMode: "userPool",
});

export const useMaturityStore = create((set, get) => ({
	assessment: null,
	assessments: [],
	processedData: null,
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
			const latestAssessment = assessments[0] || null;

			// Process assessment data if available
			let processedData = null;
			if (latestAssessment?.answers) {
				try {
					const answers = JSON.parse(latestAssessment.answers);
					processedData = latestAssessment.maturityScore
						? JSON.parse(latestAssessment.maturityScore)
						: processAssessmentData(answers);
				} catch (err) {
					console.error("Error parsing assessment data:", err);
				}
			}

			set({
				assessments,
				assessment: latestAssessment,
				processedData,
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
			const answers = JSON.stringify(data.answers);

			// Process assessment data
			const processedData = processAssessmentData(data.answers);

			// Create assessment record
			const assessmentData = {
				companyId: data.companyId,
				title: data.title || `Maturity Assessment - ${new Date().toLocaleDateString()}`,
				answers,
				maturityScore: JSON.stringify(processedData),
				status: data.status || "IN_PROGRESS",
				completedAt: data.completedAt || null,
				lastModified: timestamp,
			};

			const response = await client.models.MaturityAssessment.create(assessmentData);

			if (!response?.data) {
				throw new Error("Failed to save assessment");
			}

			// Update store state
			set((state) => ({
				assessment: response.data,
				assessments: [response.data, ...state.assessments],
				processedData,
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
		const { assessments } = get();
		const selectedAssessment = assessments.find((a) => a.id === assessmentId);

		if (selectedAssessment) {
			try {
				const answers = JSON.parse(selectedAssessment.answers);
				const processedData = selectedAssessment.maturityScore
					? JSON.parse(selectedAssessment.maturityScore)
					: processAssessmentData(answers);

				set({
					assessment: selectedAssessment,
					processedData,
				});
			} catch (err) {
				console.error("Error processing assessment data:", err);
				set({
					error: "Failed to process assessment data",
					assessment: selectedAssessment,
					processedData: null,
				});
			}
		}
	},

	reset: () => {
		set({
			assessment: null,
			assessments: [],
			processedData: null,
			loading: false,
			error: null,
		});
	},
}));
