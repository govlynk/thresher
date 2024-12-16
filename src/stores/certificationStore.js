import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";

const client = generateClient({
	authMode: "userPool",
});

export const useCertificationStore = create((set, get) => ({
	certifications: [],
	loading: false,
	error: null,

	fetchCertifications: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			set({ error: "No active company selected" });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.Certification.list({
				filter: { companyId: { eq: activeCompanyId } },
			});

			set({
				certifications: response?.data || [],
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching certifications:", err);
			set({ error: err.message, loading: false });
		}
	},

	saveCertification: async (data) => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			const response = data.id
				? await client.models.Certification.update({
						id: data.id,
						...data,
						companyId: activeCompanyId,
				  })
				: await client.models.Certification.create({
						...data,
						companyId: activeCompanyId,
				  });

			set((state) => ({
				certifications: data.id
					? state.certifications.map((c) => (c.id === data.id ? response.data : c))
					: [...state.certifications, response.data],
				loading: false,
				error: null,
			}));
			return response.data;
		} catch (err) {
			console.error("Error saving certification:", err);
			set({ error: err.message, loading: false });
			throw err;
		}
	},

	deleteCertification: async (id) => {
		set({ loading: true, error: null });
		try {
			await client.models.Certification.delete({ id });
			set((state) => ({
				certifications: state.certifications.filter((c) => c.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error deleting certification:", err);
			set({ error: err.message, loading: false });
			throw err;
		}
	},

	reset: () =>
		set({
			certifications: [],
			loading: false,
			error: null,
		}),
}));
