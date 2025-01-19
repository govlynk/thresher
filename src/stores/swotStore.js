import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useSwotStore = create((set, get) => ({
	swotData: null,
	loading: false,
	error: null,
	success: false,

	fetchSwotAnalysis: async (companyId) => {
		if (!companyId) {
			set({ error: "Company ID is required" });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.SwotAnalysis.list({
				filter: { companyId: { eq: companyId } },
				limit: 1,
			});

			set({
				swotData: response?.data?.[0] || null,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching SWOT analysis:", err);
			set({ error: err.message, loading: false });
		}
	},

	saveSwotAnalysis: async (data) => {
		set({ loading: true, error: null, success: false });
		try {
			const currentSwot = get().swotData;
			const sanitizedData = {
				strengths: data?.strengths || [],
				weaknesses: data?.weaknesses || [],
				opportunities: data?.opportunities || [],
				threats: data?.threats || [],
				companyId: data?.companyId,
				lastModified: new Date().toISOString(),
			};

			let response;
			if (currentSwot?.id) {
				response = await client.models.SwotAnalysis.update({
					id: currentSwot.id,
					...sanitizedData,
				});
			} else {
				response = await client.models.SwotAnalysis.create(sanitizedData);
			}

			set({
				swotData: response.data,
				loading: false,
				error: null,
				success: true,
			});

			return response.data;
		} catch (err) {
			console.error("Error saving SWOT analysis:", err);
			set({
				error: err.message || "Failed to save SWOT analysis",
				loading: false,
				success: false,
			});
			throw err;
		}
	},

	resetSuccess: () => set({ success: false }),

	reset: () => {
		set({
			swotData: null,
			loading: false,
			error: null,
			success: false,
		});
	},
}));
