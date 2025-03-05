import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const amplifyClient = generateClient({
	authMode: "userPool",
});

const CACHE_TIME = 60 * 60 * 1000; // 1 hour
const STALE_TIME = 30 * 60 * 1000; // 30 minutes

export const useOpportunityStore = create((set, get) => ({
	opportunities: [],
	savedOpportunities: [],
	rejectedOpportunities: [],
	notes: {},
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
			const savedOpportunities = await amplifyClient.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompanyId },
					status: { eq: "BACKLOG" },
				},
			});

			// Fetch rejected opportunities
			const rejectedOpportunities = await amplifyClient.models.Opportunity.list({
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

	// Fetch saved opportunities from database
	fetchSavedOpportunities: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) return;

		set({ loading: true });
		try {
			const response = await amplifyClient.models.Opportunity.list({
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
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		set({ loading: true });
		try {
			const response = await amplifyClient.models.Opportunity.list({
				filter: {
					and: [
						{ companyId: { eq: activeCompanyId } },
						{ status: { eq: "REJECTED" } },
						{ updatedAt: { gt: thirtyDaysAgo.toISOString() } },
					],
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
			const response = await amplifyClient.models.Opportunity.update({
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
			const rejectedOpp = await amplifyClient.models.Opportunity.list({
				filter: {
					opportunityId: { eq: opportunity.noticeId },
					status: { eq: "REJECTED" },
				},
			});

			if (rejectedOpp?.data?.[0]) {
				await amplifyClient.models.Opportunity.delete({
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
				description: opportunity.description || "No description available", // Now contains actual description text
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

			const response = await amplifyClient.models.Opportunity.create(opportunityData);

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

			// Check if opportunity already exists
			const existingOpp = await amplifyClient.models.Opportunity.list({
				filter: {
					noticeId: { eq: opportunity.noticeId },
					companyId: { eq: activeCompanyId },
				},
			});

			let savedOpportunity;
			if (existingOpp?.data?.[0]) {
				// Update existing opportunity
				const updateData = {
					id: existingOpp.data[0].id,
					noticeId: opportunity.noticeId,
					title: opportunity.title,
					description: opportunity.description,
					status: opportunity.status,
					department: opportunity.department,
					agency: opportunity.agency,
					office: opportunity.office,
					subOffice: opportunity.subOffice,
					solicitationNumber: opportunity.solicitationNumber,
					type: opportunity.type,
					typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription,
					typeOfSetAside: opportunity.typeOfSetAside,
					naicsCode: opportunity.naicsCode,
					naicsCodes: opportunity.naicsCodes,
					classificationCode: opportunity.classificationCode,
					active: opportunity.active,
					organizationType: opportunity.organizationType,
					resourceLinks: opportunity.resourceLinks,
					uiLink: opportunity.uiLink,
					officeZipcode: opportunity.officeZipcode,
					officeCity: opportunity.officeCity,
					officeCountryCode: opportunity.officeCountryCode,
					officeState: opportunity.officeState,
					pocName: opportunity.pocName,
					pocEmail: opportunity.pocEmail,
					pocPhone: opportunity.pocPhone,
					pocType: opportunity.pocType,
					position: opportunity.position,
					priority: opportunity.priority,
					estimatedEffort: opportunity.estimatedEffort,
					actualEffort: opportunity.actualEffort,
					tags: opportunity.tags,
					notes: opportunity.notes,
					assigneeId: opportunity.assigneeId,
					dueDate: opportunity.dueDate,
					postedDate: opportunity.postedDate,
					responseDeadLine: opportunity.responseDeadLine,
					companyId: activeCompanyId,
					teamId: activeTeamId,
					userId: activeUserId,
				};

				savedOpportunity = await amplifyClient.models.Opportunity.update(updateData);
			} else {
				// Create new opportunity with required fields
				const createData = {
					noticeId: opportunity.noticeId,
					title: opportunity.title,
					description: opportunity.description,
					status: opportunity.status,
					department: opportunity.department,
					agency: opportunity.agency,
					office: opportunity.office,
					subOffice: opportunity.subOffice,
					solicitationNumber: opportunity.solicitationNumber,
					type: opportunity.type,
					typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription,
					typeOfSetAside: opportunity.typeOfSetAside,
					naicsCode: opportunity.naicsCode,
					naicsCodes: opportunity.naicsCodes,
					classificationCode: opportunity.classificationCode,
					active: opportunity.active,
					organizationType: opportunity.organizationType,
					resourceLinks: opportunity.resourceLinks,
					uiLink: opportunity.uiLink,
					officeZipcode: opportunity.officeZipcode,
					officeCity: opportunity.officeCity,
					officeCountryCode: opportunity.officeCountryCode,
					officeState: opportunity.officeState,
					pocName: opportunity.pocName,
					pocEmail: opportunity.pocEmail,
					pocPhone: opportunity.pocPhone,
					pocType: opportunity.pocType,
					position: opportunity.position,
					priority: opportunity.priority,
					estimatedEffort: opportunity.estimatedEffort,
					actualEffort: opportunity.actualEffort,
					tags: opportunity.tags,
					notes: opportunity.notes,
					assigneeId: opportunity.assigneeId,
					dueDate: opportunity.dueDate,
					postedDate: opportunity.postedDate,
					responseDeadLine: opportunity.responseDeadLine,
					companyId: activeCompanyId,
					teamId: activeTeamId,
					userId: activeUserId,
				};

				console.log("Creating new opportunity with data:", createData);
				savedOpportunity = await amplifyClient.models.Opportunity.create(createData);

				if (!savedOpportunity?.data) {
					console.error("Failed to create opportunity:", savedOpportunity);
					throw new Error("Failed to create opportunity in database");
				}
			}

			// Update the local state
			const savedData = savedOpportunity.data;
			set((state) => ({
				loading: false,
				error: null,
				savedOpportunities: [...state.savedOpportunities, savedData],
				opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
			}));

			return savedData;
		} catch (error) {
			console.error("Error saving opportunity:", error);
			set({ loading: false, error: error.message });
			throw error;
		}
	},

	// Reject opportunity
	rejectOpportunity: async (opportunity) => {
		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();

		if (!activeCompanyId || !opportunity.noticeId) {
			throw new Error("Missing required data");
		}

		set({ loading: true, error: null });
		try {
			// Check if opportunity already exists
			const existingOpp = await amplifyClient.models.Opportunity.list({
				filter: {
					and: [{ noticeId: { eq: opportunity.noticeId } }, { companyId: { eq: activeCompanyId } }],
				},
				limit: 1,
			});

			if (existingOpp?.data?.[0]) {
				// Update existing opportunity
				return await amplifyClient.models.Opportunity.update({
					id: existingOpp.data[0].id,
					status: "REJECTED",
					updatedAt: new Date().toISOString(),
				});
			}

			// Create new opportunity if it doesn't exist
			const newOpportunityData = {
				status: "REJECTED",
				noticeId: opportunity.noticeId,
				updatedAt: new Date().toISOString(),
				department: opportunity.department || "N/A",
				agency: opportunity.agency || "N/A",
				office: opportunity.office || "N/A",
				subOffice: opportunity.subOffice || "N/A",
				title: opportunity.title || "",
				description: opportunity.description || "No description available", // Now contains actual description text
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

			return await amplifyClient.models.Opportunity.create(newOpportunityData);
		} catch (err) {
			console.error("Error rejecting opportunity:", err);
			throw new Error("Failed to reject opportunity");
		} finally {
			set({ loading: false });
		}
	},

	// Notes management
	updateNotes: async (opportunityId, notes) => {
		set({ loading: true, error: null });
		try {
			const response = await amplifyClient.models.Opportunity.update({
				id: opportunityId,
				notes,
				updatedAt: new Date().toISOString(),
			});

			set((state) => ({
				savedOpportunities: state.savedOpportunities.map((opp) =>
					opp.id === opportunityId ? { ...opp, notes } : opp
				),
				rejectedOpportunities: state.rejectedOpportunities.map((opp) =>
					opp.id === opportunityId ? { ...opp, notes } : opp
				),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating notes:", err);
			set({ error: err.message || "Failed to update notes", loading: false });
			throw err;
		}
	},
}));
