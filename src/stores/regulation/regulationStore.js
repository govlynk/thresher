// src/stores/regulation/regulationStore.js
import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "../globalStore";
import { getRepsAndCerts } from "../../utils/samApi";
import { processRegulationResponses, processDocumentLinks } from "../../utils/regulationUtils";

const client = generateClient();

export const useRegulationStore = create((set, get) => ({
	regulations: [],
	loading: false,
	error: null,

	fetchRegulations: async () => {
		const activeCompany = useGlobalStore.getState().getActiveCompany();
		if (!activeCompany?.uei) {
			set({ error: "No active company UEI found" });
			return;
		}

		set({ loading: true });
		try {
			const repsAndCerts = await getRepsAndCerts(activeCompany.uei);
			const regulations = processRegulationResponses(repsAndCerts);

			set({
				regulations,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching regulations:", err);
			set({
				error: err.message || "Failed to fetch regulations",
				loading: false,
			});
		}
	},
}));
