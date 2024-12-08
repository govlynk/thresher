import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { getOpportunity } from "../utils/opportunityApi";
import { useUserCompanyStore } from "./userCompanyStore";
import { useTeamTodoStore } from "./teamTodoStore";

// Initialize client with explicit auth mode
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

	initializeStore: async () => {
		const activeCompany = useUserCompanyStore.getState().getActiveCompany();
		if (!activeCompany?.id) {
			return;
		}
		// const activeTeam = useTeamTodoStore.getState().getSelectedTeamId();

		set({ loading: true, error: null });
		try {
			// Fetch saved opportunities
			const savedResponse = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompany.id },
					status: { eq: "BACKLOG" },
				},
			});

			// Fetch rejected opportunities
			const rejectedResponse = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompany.id },
					status: { eq: "REJECTED" },
				},
			});

			set({
				savedOpportunities: savedResponse.data || [],
				rejectedOpportunities: rejectedResponse.data || [],
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error initializing opportunity store:", err);
			set({
				error: err.message || "Failed to initialize opportunities",
				loading: false,
			});
		}
	},

	fetchOpportunities: async (params) => {
		set({ loading: true, error: null });
		try {
			const response = await getOpportunity(params);
			const state = get();

			// Filter out previously saved and rejected opportunities
			const savedIds = state.savedOpportunities.map((opp) => opp.opportunityId);
			const rejectedIds = state.rejectedOpportunities.map((opp) => opp.opportunityId);
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
			set({ error: err.message, loading: false });
			throw err;
		}
	},

	saveOpportunity: async (opportunity) => {
		const activeCompany = useUserCompanyStore.getState().getActiveCompany();
		if (!activeCompany?.id) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			console.log("Creating opportunity with data:", {
				opportunityId: opportunity.noticeId,
				title: opportunity.title,
				companyId: activeCompany.id,
			});

			const response = await client.models.Opportunity.create({
				opportunityId: opportunity.noticeId,
				title: opportunity.title,
				description: opportunity.description || "",
				agency: opportunity.department,
				dueDate: opportunity.responseDeadLine,
				status: "BACKLOG",
				bidProgress: 0,
				notes: "",
				attachments: [],
				companyId: activeCompany.id,
				teamId: null,
			});

			if (!response?.data) {
				throw new Error("Failed to save opportunity - no response data");
			}

			const savedOpp = response.data;
			console.log("Successfully saved opportunity:", savedOpp);

			set((state) => ({
				savedOpportunities: [...state.savedOpportunities, savedOpp],
				opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
				loading: false,
				error: null,
			}));

			return savedOpp;
		} catch (err) {
			console.error("Error saving opportunity:", err);
			set({ error: err.message || "Failed to save opportunity", loading: false });
			throw err;
		}
	},

	rejectOpportunity: async (opportunity) => {
		const activeCompany = useUserCompanyStore.getState().getActiveCompany();
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
				status: "REJECTED",
				companyId: activeCompany.id,
				teamId: null,
			});

			if (!response?.data) {
				throw new Error("Failed to reject opportunity - no response data");
			}

			const rejectedOpp = response.data;

			set((state) => ({
				rejectedOpportunities: [...state.rejectedOpportunities, rejectedOpp],
				opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
				loading: false,
				error: null,
			}));

			return rejectedOpp;
		} catch (err) {
			console.error("Error rejecting opportunity:", err);
			set({ error: err.message || "Failed to reject opportunity", loading: false });
			throw err;
		}
	},

	moveToSaved: async (opportunity) => {
		const activeCompany = useUserCompanyStore.getState().getActiveCompany();
		if (!activeCompany?.id) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			// First, delete the rejected opportunity
			const rejectedOpp = await client.models.Opportunity.list({
				filter: {
					opportunityId: { eq: opportunity.noticeId },
					status: { eq: "REJECTED" },
				},
			});

			if (rejectedOpp.data?.[0]) {
				await client.models.Opportunity.delete({
					id: rejectedOpp.data[0].id,
				});
			}

			// Then create a new saved opportunity
			const response = await client.models.Opportunity.create({
				opportunityId: opportunity.noticeId,
				title: opportunity.title,
				description: opportunity.description || "",
				agency: opportunity.department,
				dueDate: opportunity.responseDeadLine,
				status: "BACKLOG",
				bidProgress: 0,
				notes: "",
				attachments: [],
				companyId: activeCompany.id,
				teamId: null,
			});

			if (!response?.data) {
				throw new Error("Failed to move opportunity to saved - no response data");
			}

			const savedOpp = response.data;

			set((state) => ({
				savedOpportunities: [...state.savedOpportunities, savedOpp],
				rejectedOpportunities: state.rejectedOpportunities.filter(
					(opp) => opp.opportunityId !== opportunity.noticeId
				),
				loading: false,
				error: null,
			}));

			return savedOpp;
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
		});
	},
}));
