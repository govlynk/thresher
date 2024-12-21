import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "../globalStore";
import { getRepsAndCerts } from "../../utils/sam/samApi";
import { processRegulationResponses } from "../../utils/regulationUtils";

const client = generateClient();

export const useRegulationStore = create((set, get) => ({
	regulations: [],
	loading: false,
	error: null,

	fetchRegulations: async () => {
		const activeCompany = useGlobalStore.getState().getActiveCompany();

		if (!activeCompany) {
			set({ error: "No active company selected" });
			return;
		}

		if (!activeCompany.uei) {
			set({ error: "Company UEI not found" });
			return;
		}

		set({ loading: true });
		try {
			console.log("Fetching regulations for UEI:", activeCompany.uei);
			const repsAndCerts = await getRepsAndCerts(activeCompany.uei);
			const regulations = processRegulationResponses(repsAndCerts);

			console.log("Fetched regulations:", regulations);

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

	clearRegulations: () => {
		set({
			regulations: [],
			loading: false,
			error: null,
		});
	},
}));
