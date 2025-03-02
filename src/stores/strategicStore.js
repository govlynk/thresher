import { create } from "zustand";

const useStore = create((set) => ({
	companyDescription: "",
	targetMarket: "",
	competitiveAdvantage: "",
	valueProposition: "",
	marketingStrategy: "",

	// Update functions
	updateCompanyDescription: (description) => set({ companyDescription: description }),

	updateTargetMarket: (market) => set({ targetMarket: market }),

	updateCompetitiveAdvantage: (advantage) => set({ competitiveAdvantage: advantage }),

	updateValueProposition: (proposition) => set({ valueProposition: proposition }),

	updateMarketingStrategy: (strategy) => set({ marketingStrategy: strategy }),

	// Reset form
	resetForm: () =>
		set({
			companyDescription: "",
			targetMarket: "",
			competitiveAdvantage: "",
			valueProposition: "",
			marketingStrategy: "",
		}),
}));

export default useStore;
