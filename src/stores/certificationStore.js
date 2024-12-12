import { create } from "zustand";
import { useGlobalStore } from "./globalStore";
import client from "../utils/amplifyClient";

export const useCertificationStore = create((set) => ({
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
			A;
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

	reset: () =>
		set({
			certifications: [],
			loading: false,
			error: null,
		}),
}));
