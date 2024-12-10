import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";
import { useUserCompanyStore } from "./userCompanyStore";
import { getOpportunity } from "../utils/opportunityApi";

const client = generateClient({
	authMode: "userPool",
});

export const useOpportunityStore = create((set, get) => ({
	opportunities: [],
	savedOpportunities: [],
	rejectedOpportunities: [],
	lastRetrievedDate: null,
	loading: false,
	error: null,
	isInitialized: false,

	initializeStore: async () => {
		const { getActiveCompany } = useUserCompanyStore.getState();
		const activeCompany = getActiveCompany();

		if (!activeCompany?.id) {
			set({
				error: "No active company selected",
				loading: false,
				isInitialized: false,
			});
			return;
		}

		set({ loading: true, error: null });
		try {
			// Fetch saved opportunities
			const savedOpportunities = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompany.id },
					status: { eq: "BACKLOG" },
				},
			});

			// Fetch rejected opportunities
			const rejectedOpportunities = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompany.id },
					status: { eq: "REJECTED" },
				},
			});

			set({
				savedOpportunities: savedOpportunities?.data || [],
				rejectedOpportunities: rejectedOpportunities?.data || [],
				loading: false,
				error: null,
				isInitialized: true,
			});
		} catch (err) {
			console.error("Error initializing opportunity store:", err);
			set({
				error: "Failed to initialize opportunity store",
				loading: false,
				isInitialized: false,
			});
		}
	},

	setOpportunities: (opportunities) => {
		console.log("setOpportunities", { count: opportunities.length });
		set({ opportunities });
	},

	fetchOpportunities: async (params) => {
		const state = get();
		if (!state.isInitialized) {
			console.log("Initializing store before fetching opportunities...");
			await state.initializeStore();
		}

		const { getActiveCompany } = useUserCompanyStore.getState();
		const activeCompany = getActiveCompany();

		if (!activeCompany?.id) {
			set({
				error: "No active company selected",
				loading: false,
			});
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await getOpportunity(params);
			const currentState = get();

			// Filter out previously saved and rejected opportunities
			const savedIds = currentState.savedOpportunities.map((opp) => opp.opportunityId);
			const rejectedIds = currentState.rejectedOpportunities.map((opp) => opp.opportunityId);
			const filteredOpportunities = response.filter(
				(opp) => !savedIds.includes(opp.noticeId) && !rejectedIds.includes(opp.noticeId)
			);

			set({
				opportunities: filteredOpportunities,
				lastRetrievedDate: new Date().toISOString(),
				loading: false,
			});

			return filteredOpportunities;
		} catch (err) {
			console.error("Error fetching opportunities:", err);
			set({
				error: err.message || "Failed to fetch opportunities",
				loading: false,
			});
			return [];
		}
	},

	// Rest of the store implementation remains unchanged...
	saveOpportunity: async (opportunity) => {
		const state = get();
		if (!state.isInitialized) {
			await state.initializeStore();
		}

		const { getActiveCompany } = useUserCompanyStore.getState();
		const activeCompany = getActiveCompany();
		const { activeTeamId } = useGlobalStore.getState();

		if (!activeCompany?.id) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.Opportunity.create({
				opportunityId: opportunity.noticeId,
				title: opportunity.title,
				description: opportunity.description || "",
				agency: opportunity.department,
				dueDate: opportunity.responseDeadLine,
				status: "BACKLOG",
				notes: "",
				companyId: activeCompany.id,
				teamId: activeTeamId,
				// ... rest of opportunity data
			});

			if (!response?.data) {
				throw new Error("Failed to save opportunity");
			}

			set((state) => ({
				savedOpportunities: [...state.savedOpportunities, response.data],
				opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error saving opportunity:", err);
			set({
				error: err.message || "Failed to save opportunity",
				loading: false,
			});
			throw err;
		}
	},

	rejectOpportunity: async (opportunity) => {
		const { getActiveCompany } = useUserCompanyStore.getState();
		const activeCompany = getActiveCompany();
		const { activeTeamId } = useGlobalStore.getState();

		if (!activeCompany?.id) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.Opportunity.create({
				status: "REJECTED",
				opportunityId: opportunity.noticeId,
				title: opportunity.title,
				description: opportunity.description || "",
				agency: opportunity.department,
				dueDate: opportunity.responseDeadLine,
				notes: "",
				companyId: activeCompany.id,
				teamId: activeTeamId,
				// ... rest of opportunity data
			});

			if (!response?.data) {
				throw new Error("Failed to reject opportunity");
			}

			set((state) => ({
				rejectedOpportunities: [...state.rejectedOpportunities, response.data],
				opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error rejecting opportunity:", err);
			set({ error: err.message || "Failed to reject opportunity", loading: false });
			throw err;
		}
	},

	moveToSaved: async (opportunity) => {
		const { getActiveCompany } = useUserCompanyStore.getState();
		const activeCompany = getActiveCompany();
		const { activeTeamId } = useGlobalStore.getState();

		if (!activeCompany?.id) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			// First, find and delete the rejected opportunity
			const rejectedOpp = await client.models.Opportunity.list({
				filter: {
					opportunityId: { eq: opportunity.noticeId },
					status: { eq: "REJECTED" },
				},
			});

			if (rejectedOpp?.data?.[0]) {
				await client.models.Opportunity.delete({
					id: rejectedOpp.data[0].id,
				});
			}

			// Then create a new saved opportunity
			const response = await client.models.Opportunity.create({
				status: "BACKLOG",
				opportunityId: opportunity.noticeId,
				title: opportunity.title,
				description: opportunity.description || "",
				agency: opportunity.department,
				dueDate: opportunity.responseDeadLine,
				notes: "",
				companyId: activeCompany.id,
				teamId: activeTeamId,
				// ... rest of opportunity data
			});

			if (!response?.data) {
				throw new Error("Failed to move opportunity to saved");
			}

			set((state) => ({
				savedOpportunities: [...state.savedOpportunities, response.data],
				rejectedOpportunities: state.rejectedOpportunities.filter(
					(opp) => opp.opportunityId !== opportunity.noticeId
				),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error moving opportunity to saved:", err);
			set({ error: err.message || "Failed to move opportunity to saved", loading: false });
			throw err;
		}
	},

	resetStore: () => {
		set({
			opportunities: [],
			savedOpportunities: [],
			rejectedOpportunities: [],
			lastRetrievedDate: null,
			loading: false,
			error: null,
			isInitialized: false,
		});
	},
}));
