import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useCertificationStore = create((set, get) => ({
	certifications: [],
	loading: false,
	error: null,

	fetchCertifications: async (companyId) => {
		if (!companyId) {
			set({ error: "Company ID is required" });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.Certification.list({
				filter: { companyId: { eq: companyId } },
			});

			set({
				certifications: response.data || [],
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching certifications:", err);
			set({
				error: err.message || "Failed to fetch certifications",
				loading: false,
			});
		}
	},

	addCertification: async (certData) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.Certification.create(certData);

			set((state) => ({
				certifications: [...state.certifications, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error adding certification:", err);
			set({
				error: err.message || "Failed to add certification",
				loading: false,
			});
			throw err;
		}
	},

	updateCertification: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.Certification.update({
				id,
				...updates,
			});

			set((state) => ({
				certifications: state.certifications.map((cert) => (cert.id === id ? response.data : cert)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating certification:", err);
			set({
				error: err.message || "Failed to update certification",
				loading: false,
			});
			throw err;
		}
	},

	deleteCertification: async (id) => {
		set({ loading: true, error: null });
		try {
			await client.models.Certification.delete({ id });

			set((state) => ({
				certifications: state.certifications.filter((cert) => cert.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error deleting certification:", err);
			set({
				error: err.message || "Failed to delete certification",
				loading: false,
			});
			throw err;
		}
	},

	reset: () => {
		set({
			certifications: [],
			loading: false,
			error: null,
		});
	},
}));
