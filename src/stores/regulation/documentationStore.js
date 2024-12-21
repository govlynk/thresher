// src/stores/regulation/documentStore.js
import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "../globalStore";
import { getRepsAndCerts } from "../../utils/sam/samApi";
import { processDocumentLinks } from "../../utils/regulationUtils";

const client = generateClient();

export const useDocumentStore = create((set) => ({
	documents: null,
	loading: false,
	error: null,

	fetchDocuments: async () => {
		const activeCompany = useGlobalStore.getState().getActiveCompany();
		if (!activeCompany?.uei) {
			set({ error: "No active company UEI found" });
			return;
		}

		set({ loading: true });
		try {
			const repsAndCerts = await getRepsAndCerts(activeCompany.uei);
			const documents = processDocumentLinks(repsAndCerts);

			set({
				documents,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching documents:", err);
			set({
				error: err.message || "Failed to fetch documents",
				loading: false,
			});
		}
	},
}));
