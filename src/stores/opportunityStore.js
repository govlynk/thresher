import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";
import { getOpportunity } from "../utils/opportunityApi";

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
	isInitialized: false,

	initializeStore: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		console.log("fetchSavedOpportunities", { activeCompanyId });
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
			// Now fetch the actual data
			try {
				const savedOpportunities = await client.models.Opportunity.list({
					filter: {
						companyId: {
							eq: activeCompany.id,
						},
						status: {
							eq: "BACKLOG",
						},
					},
				});

				const rejectedOpportunities = await client.models.Opportunity.list({
					filter: {
						companyId: {
							eq: activeCompany.id,
						},
						status: {
							eq: "REJECTED",
						},
					},
				});

				// If we get here, the model exists and is accessible
				set({ isInitialized: true });

				// Handle empty results properly
				set({
					savedOpportunities: savedOpportunities?.data || [],
					rejectedOpportunities: rejectedOpportunities?.data || [],
					loading: false,
					error: null,
				});
			} catch (queryError) {
				// Handle query errors but don't fail initialization
				console.error("Error querying opportunities:", queryError);
				set({
					savedOpportunities: [],
					rejectedOpportunities: [],
					loading: false,
					error: "Failed to load opportunities",
				});
			}
		} catch (initError) {
			console.error("Error initializing opportunity store:", initError);
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

		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
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

	saveOpportunity: async (opportunity) => {
		const state = get();
		if (!state.isInitialized) {
			await state.initializeStore();
		}

		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();
		console.log("saveOpportunity", { opportunity, activeCompanyId, activeTeamId });

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.Opportunity.create({
				data: {
					opportunityId: opportunity.noticeId,
					title: opportunity.title,
					description: opportunity.description || "",
					agency: opportunity.department,
					dueDate: opportunity.responseDeadLine,
					status: "BACKLOG",
					notes: "",

					solicitationNumber: opportunity.solicitationNumber || "",
					fullParentPathName: opportunity.fullParentPathName || "",
					fullParentPathCode: opportunity.fullParentPathCode || "",
					postedDate: opportunity.postedDate,
					type: opportunity.type || "",
					typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
					typeOfSetAside: opportunity.typeOfSetAside || "",
					responseDeadLine: opportunity.responseDeadLine,
					naicsCode: opportunity.naicsCode || "",
					naicsCodes: opportunity.naicsCodes,
					classificationCode: opportunity.classificationCode || "",
					active: opportunity.active || "Yes",
					description: opportunity.description || "",
					organizationType: opportunity.organizationType || "",
					resourceLinks: opportunity.resourceLinks,
					uiLink: opportunity.uiLink,

					// Office Address as embedded fields
					officeZipcode: opportunity.officeAddress.officeZipcode || "",
					officeCity: opportunity.officeAddress.officeCity || "",
					officeCountryCode: opportunity.officeAddress.officeCountryCode || "",
					officeState: opportunity.officeAddress.officeState || "",

					// Point of Contact as embedded fields
					pocName: opportunity.pointOfContact.pocName || "",
					pocEmail: opportunity.pointOfContact.pocEmail || "",
					pocPhone: opportunity.pointOfContact.pocPhone || "",
					pocType: opportunity.pointOfContact.pocType || "",

					// Foreign key relationships
					userId: activeUserId,
					companyId: activeCompanyId,
					teamId: activeTeamId,
				},
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
		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();
		console.log("rejectOpportunity", { opportunity, activeCompanyId, activeTeamId });

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			// Create rejected opportunity using Gen 2 syntax
			const response = await client.models.Opportunity.create({
				data: {
					status: "REJECTED",
					opportunityId: opportunity.noticeId,
					title: opportunity.title,
					description: opportunity.description || "",
					agency: opportunity.department,
					dueDate: opportunity.responseDeadLine,
					notes: "",

					solicitationNumber: opportunity.solicitationNumber || "",
					fullParentPathName: opportunity.fullParentPathName || "",
					fullParentPathCode: opportunity.fullParentPathCode || "",
					postedDate: opportunity.postedDate,
					type: opportunity.type || "",
					typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
					typeOfSetAside: opportunity.typeOfSetAside || "",
					responseDeadLine: opportunity.responseDeadLine,
					naicsCode: opportunity.naicsCode || "",
					naicsCodes: opportunity.naicsCodes,
					classificationCode: opportunity.classificationCode || "",
					active: opportunity.active || "Yes",
					description: opportunity.description || "",
					organizationType: opportunity.organizationType || "",
					resourceLinks: opportunity.resourceLinks,
					uiLink: opportunity.uiLink,

					// Office Address as embedded fields
					officeZipcode: opportunity.officeAddress.officeZipcode || "",
					officeCity: opportunity.officeAddress.officeCity || "",
					officeCountryCode: opportunity.officeAddress.officeCountryCode || "",
					officeState: opportunity.officeAddress.officeState || "",

					// Point of Contact as embedded fields
					pocName: opportunity.pointOfContact.pocName || "",
					pocEmail: opportunity.pointOfContact.pocEmail || "",
					pocPhone: opportunity.pointOfContact.pocPhone || "",
					pocType: opportunity.pointOfContact.pocType || "",

					// Foreign key relationships
					userId: activeUserId,
					companyId: activeCompanyId,
					teamId: activeTeamId,
				},
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
		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();
		console.log("rejectOpportunity", { opportunity, activeCompanyId, activeTeamId });

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}
		set({ loading: true, error: null });
		try {
			// First, find and delete the rejected opportunity using Gen 2 syntax
			const rejectedOpp = await client.models.Opportunity.findMany({
				where: {
					and: [{ opportunityId: { eq: opportunity.noticeId } }, { status: { eq: "REJECTED" } }],
				},
			});

			if (rejectedOpp.data?.[0]) {
				await client.models.Opportunity.delete({
					id: rejectedOpp.data[0].id,
				});
			}

			// Then create a new saved opportunity using Gen 2 syntax
			const response = await client.models.Opportunity.create({
				data: {
					status: "BACKLOG",
					opportunityId: opportunity.noticeId,
					title: opportunity.title,
					description: opportunity.description || "",
					agency: opportunity.department,
					dueDate: opportunity.responseDeadLine,
					notes: "",

					solicitationNumber: opportunity.solicitationNumber || "",
					fullParentPathName: opportunity.fullParentPathName || "",
					fullParentPathCode: opportunity.fullParentPathCode || "",
					postedDate: opportunity.postedDate,
					type: opportunity.type || "",
					typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
					typeOfSetAside: opportunity.typeOfSetAside || "",
					responseDeadLine: opportunity.responseDeadLine,
					naicsCode: opportunity.naicsCode || "",
					naicsCodes: opportunity.naicsCodes,
					classificationCode: opportunity.classificationCode || "",
					active: opportunity.active || "Yes",
					description: opportunity.description || "",
					organizationType: opportunity.organizationType || "",
					resourceLinks: opportunity.resourceLinks,
					uiLink: opportunity.uiLink,

					// Office Address as embedded fields
					officeZipcode: opportunity.officeAddress.officeZipcode || "",
					officeCity: opportunity.officeAddress.officeCity || "",
					officeCountryCode: opportunity.officeAddress.officeCountryCode || "",
					officeState: opportunity.officeAddress.officeState || "",

					// Point of Contact as embedded fields
					pocName: opportunity.pointOfContact.pocName || "",
					pocEmail: opportunity.pointOfContact.pocEmail || "",
					pocPhone: opportunity.pointOfContact.pocPhone || "",
					pocType: opportunity.pointOfContact.pocType || "",

					// Foreign key relationships
					userId: activeUserId,
					companyId: activeCompanyId,
					teamId: activeTeamId,
				},
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
