import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const client = generateClient({
	authMode: "userPool",
});

const CACHE_TIME = 60 * 60 * 1000; // 1 hour
const STALE_TIME = 30 * 60 * 1000; // 30 minutes

export const useOpportunityStore = create((set, get) => ({
	opportunities: [],
	savedOpportunities: [],
	rejectedOpportunities: [],
	lastRetrievedDate: null,
	loading: false,
	error: null,
	isInitialized: false,
	queryClient: null,

	setQueryClient: (client) => set({ queryClient: client }),

	initializeStore: async () => {
		const { activeCompanyId } = useGlobalStore.getState();

		if (!activeCompanyId) {
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
					companyId: { eq: activeCompanyId },
					status: { eq: "BACKLOG" },
				},
			});

			// Fetch rejected opportunities
			const rejectedOpportunities = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompanyId },
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
		set({ opportunities });
	},

	// Fetch saved opportunities from database
	fetchSavedOpportunities: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) return;

		set({ loading: true });
		try {
			const response = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompanyId },
					status: { ne: "REJECTED" },
				},
			});
			set({ savedOpportunities: response.data || [], loading: false });
		} catch (err) {
			console.error("Error fetching saved opportunities:", err);
			set({ error: err.message, loading: false });
		}
	},

	// Fetch rejected opportunities
	fetchRejectedOpportunities: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) return;

		set({ loading: true });
		try {
			const response = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompanyId },
					status: { eq: "REJECTED" },
				},
			});
			set({ rejectedOpportunities: response.data || [], loading: false });
		} catch (err) {
			console.error("Error fetching rejected opportunities:", err);
			set({ error: err.message, loading: false });
		}
	},

	// Move opportunity between pipeline stages
	moveOpportunity: async (opportunityId, newStatus) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.Opportunity.update({
				id: opportunityId,
				status: newStatus,
			});

			if (!response?.data) {
				throw new Error("Failed to update opportunity status");
			}

			// Update local state
			await get().fetchSavedOpportunities();
			set({ loading: false });
			return response.data;
		} catch (err) {
			console.error("Error moving opportunity:", err);
			set({ error: err.message, loading: false });
			throw err;
		}
	},

	moveToSaved: async (opportunity) => {
		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();

		if (!activeCompanyId) {
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
			const opportunityData = {
				status: "BACKLOG",
				noticeId: opportunity.noticeId,
				department: opportunity.department || "N/A",
				agency: opportunity.agency || "N/A",
				office: opportunity.office || "N/A",
				subOffice: opportunity.subOffice || "N/A",
				title: opportunity.title || "",
				description: opportunity.description || "",

				// Agency hierarchy
				department: opportunity?.department || "N/A",
				agency: opportunity?.agency || "N/A",
				office: opportunity?.office || "N/A",
				subOffice: opportunity?.subOffice || "N/A",

				solicitationNumber: opportunity.solicitationNumber || "",
				postedDate: opportunity.postedDate ? new Date(opportunity.postedDate).toISOString() : null,
				type: opportunity.type || "",
				typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
				typeOfSetAside: opportunity.typeOfSetAside || "",
				responseDeadLine: opportunity.responseDeadLine
					? new Date(opportunity.responseDeadLine).toISOString()
					: null,
				naicsCode: opportunity.naicsCode || "",
				naicsCodes: opportunity.naicsCodes || "",
				classificationCode: opportunity.classificationCode || "",
				active: opportunity.active || "Yes",
				organizationType: opportunity.organizationType || "",
				resourceLinks: opportunity.resourceLinks || "",
				uiLink: opportunity.uiLink || "",
				// Office Address as embedded fields
				officeZipcode: opportunity.officeZipcode || "",
				officeCity: opportunity.officeCity || "",
				officeCountryCode: opportunity.officeCountryCode || "",
				officeState: opportunity.officeState || "",
				// Point of Contact as embedded fields
				pocName: opportunity.pocName || "",
				pocEmail: opportunity.pocEmail || "",
				pocPhone: opportunity.pocPhone || "",
				pocType: opportunity.pocType || "",
				// Default Pipeline fields
				position: 0,
				priority: "MEDIUM",
				estimatedEffort: 0,
				actualEffort: 0,
				tags: "",
				notes: "",
				assigneeId: activeUserId,
				// set initial due date to response deadline
				dueDate: opportunity.responseDeadLine ? new Date(opportunity.responseDeadLine).toISOString() : null,

				notes: "",

				// Foreign key relationships
				userId: activeUserId,
				companyId: activeCompanyId,
				teamId: activeTeamId,
			};

			const response = await client.models.Opportunity.create(opportunityData);

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

	// Save new opportunity
	saveOpportunity: async (opportunity) => {
		const state = get();
		if (!state.isInitialized) {
			await state.initializeStore();
		}

		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();
		console.log("Active Company ID: ", activeCompanyId);
		console.log("Active Team ID: ", activeTeamId);
		console.log("Active User ID: ", activeUserId);

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			console.log("OpportunityStore: Saving opportunity:", opportunity);

			const opportunityData = {
				status: "BACKLOG",
				noticeId: opportunity.noticeId,
				department: opportunity.department || "N/A",
				agency: opportunity.agency || "N/A",
				office: opportunity.office || "N/A",
				subOffice: opportunity.subOffice || "N/A",
				title: opportunity.title || "",
				description: opportunity.description || "",
				solicitationNumber: opportunity.solicitationNumber || "",
				postedDate: opportunity.postedDate ? new Date(opportunity.postedDate).toISOString() : null,
				type: opportunity.type || "",
				typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
				typeOfSetAside: opportunity.typeOfSetAside || "",
				responseDeadLine: opportunity.responseDeadLine
					? new Date(opportunity.responseDeadLine).toISOString()
					: null,
				naicsCode: opportunity.naicsCode || "",
				naicsCodes: opportunity.naicsCodes || "",
				classificationCode: opportunity.classificationCode || "",
				active: opportunity.active || "Yes",
				organizationType: opportunity.organizationType || "",
				resourceLinks: opportunity.resourceLinks || "",
				uiLink: opportunity.uiLink || "",
				// Office Address as embedded fields
				officeZipcode: opportunity.officeZipcode || "",
				officeCity: opportunity.officeCity || "",
				officeCountryCode: opportunity.officeCountryCode || "",
				officeState: opportunity.officeState || "",
				// Point of Contact as embedded fields
				pocName: opportunity.pocName || "",
				pocEmail: opportunity.pocEmail || "",
				pocPhone: opportunity.pocPhone || "",
				pocType: opportunity.pocType || "",
				// Default Pipeline fields
				position: 0,
				priority: "MEDIUM",
				estimatedEffort: 0,
				actualEffort: 0,
				tags: "",
				notes: "",
				assigneeId: activeUserId,
				// set initial due date to response deadline
				dueDate: opportunity.responseDeadLine ? new Date(opportunity.responseDeadLine).toISOString() : null,

				notes: "",

				// Foreign key relationships
				userId: activeUserId,
				companyId: activeCompanyId,
				teamId: activeTeamId,
			};

			const response = await client.models.Opportunity.create(opportunityData);
			console.log("Saved opportunity response:", response);

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
			set({ error: err.message || "Failed to save opportunity", loading: false });
			throw err;
		}
	},

	// Reject opportunity
	rejectOpportunity: async (opportunity) => {
		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			const opportunityData = {
				status: "REJECTED",
				noticeId: opportunity.noticeId,
				department: opportunity.department || "N/A",
				agency: opportunity.agency || "N/A",
				office: opportunity.office || "N/A",
				subOffice: opportunity.subOffice || "N/A",
				title: opportunity.title || "",
				description: opportunity.description || "",
				solicitationNumber: opportunity.solicitationNumber || "",
				postedDate: opportunity.postedDate ? new Date(opportunity.postedDate).toISOString() : null,
				type: opportunity.type || "",
				typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
				typeOfSetAside: opportunity.typeOfSetAside || "",
				responseDeadLine: opportunity.responseDeadLine
					? new Date(opportunity.responseDeadLine).toISOString()
					: null,
				naicsCode: opportunity.naicsCode || "",
				naicsCodes: opportunity.naicsCodes || "",
				classificationCode: opportunity.classificationCode || "",
				active: opportunity.active || "Yes",
				organizationType: opportunity.organizationType || "",
				resourceLinks: opportunity.resourceLinks || "",
				uiLink: opportunity.uiLink || "",
				// Office Address as embedded fields
				officeZipcode: opportunity.officeZipcode || "",
				officeCity: opportunity.officeCity || "",
				officeCountryCode: opportunity.officeCountryCode || "",
				officeState: opportunity.officeState || "",
				// Point of Contact as embedded fields
				pocName: opportunity.pocName || "",
				pocEmail: opportunity.pocEmail || "",
				pocPhone: opportunity.pocPhone || "",
				pocType: opportunity.pocType || "",
				// Default Pipeline fields
				position: 0,
				priority: "MEDIUM",
				estimatedEffort: 0,
				actualEffort: 0,
				tags: "",
				notes: "",
				assigneeId: activeUserId,
				// set initial due date to response deadline
				dueDate: opportunity.responseDeadLine ? new Date(opportunity.responseDeadLine).toISOString() : null,

				notes: "",

				// Foreign key relationships
				userId: activeUserId,
				companyId: activeCompanyId,
				teamId: activeTeamId,
			};

			const response = await client.models.Opportunity.create(opportunityData);

			console.log("Rejected opportunity response:", response);

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
			set({ error: err.message, loading: false });
			throw err;
		}
	},
}));
