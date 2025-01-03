import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useMaturityStore = create((set, get) => ({
	assessment: null,
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
			console.log("[MaturityStore] Making list request with filter:", { companyId });
			const response = await client.models.MaturityAssessment.list({
				filter: { companyId: { eq: companyId } },
				sort: { field: "createdAt", direction: "DESC" },
				limit: 1,
			});

			console.log("[MaturityStore] List response:", response);

			set({
				assessment: response?.data?.[0] || null,
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
			const currentAssessment = get().assessment;
			const timestamp = new Date().toISOString();

			console.log("[MaturityStore] Current assessment state:", currentAssessment);

			// Prepare the data object
			const assessmentData = {
				companyId: data.companyId,
				answers: JSON.stringify(data.answers), // Ensure answers are stringified
				status: data.status || "IN_PROGRESS",
				completedAt: data.completedAt || null,
				lastModified: timestamp,
			};

			let response;
			if (currentAssessment?.id) {
				console.log("[MaturityStore] Updating existing assessment:", {
					id: currentAssessment.id,
					...assessmentData,
				});

				try {
					response = await client.models.MaturityAssessment.update({
						id: currentAssessment.id,
						...assessmentData,
					});
					console.log("[MaturityStore] Update response:", response);
				} catch (updateError) {
					console.error("[MaturityStore] Update failed:", updateError);
					throw updateError;
				}
			} else {
				console.log("[MaturityStore] Creating new assessment:", assessmentData);

				try {
					response = await client.models.MaturityAssessment.create(assessmentData);
					console.log("[MaturityStore] Create response:", response);
				} catch (createError) {
					console.error("[MaturityStore] Create failed:", createError);
					throw createError;
				}
			}

			// Validate response
			if (!response) {
				console.error("[MaturityStore] No response received from API");
				throw new Error("No response received from API");
			}

			if (!response.data) {
				console.error("[MaturityStore] Response missing data:", response);
				throw new Error("Response missing data");
			}

			// Update store state
			set({
				assessment: response.data,
				loading: false,
				error: null,
			});

			console.log("[MaturityStore] Successfully saved assessment:", response.data);
			return response.data;
		} catch (err) {
			console.error("[MaturityStore] Error saving assessment:", {
				error: err,
				message: err.message,
				stack: err.stack,
				data: data,
			});

			set({
				error: `Failed to save assessment: ${err.message}`,
				loading: false,
			});

			throw new Error(`Failed to save assessment: ${err.message}`);
		}
	},

	reset: () => {
		console.log("[MaturityStore] Resetting store state");
		set({
			assessment: null,
			loading: false,
			error: null,
		});
	},
}));
