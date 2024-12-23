import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

const initialState = {
	activeStep: 0,
	loading: false,
	error: null,
	initialized: false,
	formData: {
		aboutUs: "",
		keyCapabilities: [],
		competitiveAdvantage: "",
		mission: "",
		vision: "",
		keywords: [],
		pastPerformances: [],
		certifications: [],
	},
	existingData: null,
};

export const useCapabilityStatementStore = create((set, get) => ({
	...initialState,

	initializeForm: async (companyId) => {
		const state = get();
		if (state.initialized || !companyId) return;

		set({ loading: true, error: null });
		try {
			// Fetch existing data
			const [capabilityResponse, performancesResponse, certificationsResponse] = await Promise.all([
				client.models.CapabilityStatement.list({
					filter: { companyId: { eq: companyId } },
				}),
				client.models.PastPerformance.list({
					filter: { companyId: { eq: companyId } },
				}),
				client.models.Certification.list({
					filter: { companyId: { eq: companyId } },
				}),
			]);

			const existingData = {
				capabilityStatement: capabilityResponse.data?.[0] || null,
				pastPerformances: performancesResponse.data || [],
				certifications: certificationsResponse.data || [],
			};

			// Initialize form data
			if (existingData.capabilityStatement) {
				set({
					formData: {
						aboutUs: existingData.capabilityStatement.aboutUs || "",
						keyCapabilities: existingData.capabilityStatement.keyCapabilities || [],
						competitiveAdvantage: existingData.capabilityStatement.competitiveAdvantage || "",
						mission: existingData.capabilityStatement.mission || "",
						vision: existingData.capabilityStatement.vision || "",
						keywords: existingData.capabilityStatement.keywords || [],
						pastPerformances: existingData.pastPerformances,
						certifications: existingData.certifications,
					},
					existingData,
					initialized: true,
				});
			} else {
				set({ initialized: true });
			}

			set({ loading: false });
		} catch (err) {
			console.error("Error initializing form:", err);
			set({
				error: err.message,
				loading: false,
				initialized: true,
			});
		}
	},

	setAnswer: (questionId, answer) =>
		set((state) => ({
			answers: { ...state.answers, [questionId]: answer },
		})),

	setFormData: (data) =>
		set((state) => ({
			formData: { ...state.formData, ...data },
		})),

	nextStep: () =>
		set((state) => ({
			activeStep: state.activeStep + 1,
		})),

	prevStep: () =>
		set((state) => ({
			activeStep: Math.max(0, state.activeStep - 1),
		})),

	resetForm: () => set(initialState),

	submitForm: async (companyId) => {
		if (!companyId) {
			throw new Error("Company ID is required");
		}

		const state = get();
		set({ loading: true, error: null });

		try {
			// 1. Submit/Update Capability Statement
			const capabilityData = {
				companyId,
				aboutUs: state.formData.aboutUs,
				keyCapabilities: state.formData.keyCapabilities,
				competitiveAdvantage: state.formData.competitiveAdvantage,
				mission: state.formData.mission,
				vision: state.formData.vision,
				keywords: state.formData.keywords,
				lastModified: new Date().toISOString(),
			};

			if (state.existingData?.capabilityStatement?.id) {
				await client.models.CapabilityStatement.update({
					id: state.existingData.capabilityStatement.id,
					...capabilityData,
				});
			} else {
				await client.models.CapabilityStatement.create(capabilityData);
			}

			// 2. Submit/Update Past Performances
			const existingPerformanceIds = new Set(state.existingData?.pastPerformances?.map((p) => p.id) || []);

			// Delete removed performances
			for (const performance of state.existingData?.pastPerformances || []) {
				if (!state.formData.pastPerformances.find((p) => p.id === performance.id)) {
					await client.models.PastPerformance.delete({ id: performance.id });
				}
			}

			// Create/Update performances
			for (const performance of state.formData.pastPerformances) {
				if (performance.id && existingPerformanceIds.has(performance.id)) {
					await client.models.PastPerformance.update({
						id: performance.id,
						...performance,
						companyId,
					});
				} else {
					await client.models.PastPerformance.create({
						...performance,
						companyId,
					});
				}
			}

			// 3. Submit/Update Certifications
			const existingCertIds = new Set(state.existingData?.certifications?.map((c) => c.id) || []);

			// Delete removed certifications
			for (const cert of state.existingData?.certifications || []) {
				if (!state.formData.certifications.find((c) => c.id === cert.id)) {
					await client.models.Certification.delete({ id: cert.id });
				}
			}

			// Create/Update certifications
			for (const cert of state.formData.certifications) {
				if (cert.id && existingCertIds.has(cert.id)) {
					await client.models.Certification.update({
						id: cert.id,
						...cert,
						companyId,
					});
				} else {
					await client.models.Certification.create({
						...cert,
						companyId,
					});
				}
			}

			set({ loading: false });
			return true;
		} catch (err) {
			console.error("Error submitting form:", err);
			set({
				error: err.message || "Failed to submit capability statement",
				loading: false,
			});
			throw err;
		}
	},
}));
