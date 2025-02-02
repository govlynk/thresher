import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useTargetAgencyStore = create((set, get) => ({
	agencies: [],
	loading: false,
	error: null,
	subscription: null,

	// Fetch target agencies for a company
	fetchTargetAgencies: async (companyId) => {
		if (!companyId) {
			throw new Error("Company ID is required");
		}

		// Cleanup existing subscription
		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
		}

		set({ loading: true });
		try {
			// Set up subscription for real-time updates
			const subscription = client.models.TargetAgency.observeQuery({
				filter: { companyId: { eq: companyId } },
			}).subscribe({
				next: ({ items }) => {
					set({
						agencies: items,
						loading: false,
						error: null,
					});
				},
				error: (err) => {
					console.error("Error in target agency subscription:", err);
					set({
						error: err.message || "Failed to fetch target agencies",
						loading: false,
					});
				},
			});

			set({ subscription });
			return get().agencies;
		} catch (err) {
			console.error("Error fetching target agencies:", err);
			set({ loading: false });
			throw err;
		}
	},

	// Add new target agency
	addTargetAgency: async (agencyData) => {
		console.log("***agencyData", agencyData);
		set({ loading: true, error: null });

		try {
			// Validate required fields
			if (!agencyData.agencyId || !agencyData.name || !agencyData.companyId) {
				throw new Error("Missing required fields: agencyId, name, or companyId");
			}

			// Check if agency is already targeted
			const existing = get().agencies.find((a) => a.agencyId === agencyData.agencyId);
			if (existing) {
				throw new Error("This agency is already targeted");
			}

			// Create new target agency with sanitized data
			const response = await client.models.TargetAgency.create({
				agencyId: agencyData.agencyId,
				toptier_code: agencyData.toptier_code,
				name: agencyData.name,
				mission: agencyData.mission || null,
				about: agencyData.about || null,
				abbreviation: agencyData.abbreviation || null,
				subtier_agency_count: agencyData.subtier_agency_count || 0,
				icon_filename: agencyData.icon_filename || null,
				website: agencyData.website || null,
				congressional_justification_url: agencyData.congressional_justification_url || null,
				companyId: agencyData.companyId,
				lastModified: new Date().toISOString(),
			});
			console.log("***response", response);

			set({ loading: false });
			return response.data;
		} catch (err) {
			console.error("Error adding target agency:", err);
			set({
				error: err.message || "Failed to add target agency",
				loading: false,
			});
			throw err;
		}
	},

	// Update existing target agency
	updateTargetAgency: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.TargetAgency.update({
				id,
				...updates,
				lastModified: new Date().toISOString(),
			});

			set({ loading: false });
			return response.data;
		} catch (err) {
			console.error("Error updating target agency:", err);
			set({
				error: err.message || "Failed to update target agency",
				loading: false,
			});
			throw err;
		}
	},

	// Remove target agency
	removeTargetAgency: async (id) => {
		set({ loading: true, error: null });
		try {
			await client.models.TargetAgency.delete({ id });
			set({ loading: false });
		} catch (err) {
			console.error("Error removing target agency:", err);
			set({
				error: err.message || "Failed to remove target agency",
				loading: false,
			});
			throw err;
		}
	},

	// Get a single target agency by ID
	getTargetAgency: async (id) => {
		try {
			const response = await client.models.TargetAgency.get({ id });
			return response.data;
		} catch (err) {
			console.error("Error getting target agency:", err);
			throw err;
		}
	},

	// Check if an agency is already targeted
	isAgencyTargeted: (agencyId) => {
		return get().agencies.some((agency) => agency.agencyId === agencyId);
	},

	// Cleanup function
	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
		set({
			agencies: [],
			loading: false,
			error: null,
			subscription: null,
		});
	},
}));
