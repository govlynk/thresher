import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateClient } from "aws-amplify/data";
import { getOpportunity } from "../utils/opportunityApi";

const client = generateClient();

export const useOpportunityStore = create(
	persist(
		(set, get) => ({
			opportunities: [],
			savedOpportunities: [],
			rejectedOpportunities: [],
			lastRetrievedDate: null,
			loading: false,
			error: null,
			isInitialized: false,

			fetchOpportunities: async (params) => {
				const state = get();
				// Return early if already loading or initialized
				if (state.loading || (state.isInitialized && state.opportunities.length > 0)) {
					return;
				}

				set({ loading: true, error: null });
				try {
					const response = await getOpportunity(params);

					// Filter out previously saved and rejected opportunities
					const savedIds = state.savedOpportunities.map((opp) => opp.noticeId);
					const rejectedIds = state.rejectedOpportunities.map((opp) => opp.noticeId);
					const filteredOpportunities = response.filter(
						(opp) => !savedIds.includes(opp.noticeId) && !rejectedIds.includes(opp.noticeId)
					);

					set({
						opportunities: filteredOpportunities,
						lastRetrievedDate: new Date().toISOString(),
						loading: false,
						isInitialized: true,
					});

					return filteredOpportunities;
				} catch (err) {
					console.error("Error fetching opportunities:", err);
					set({ error: err.message, loading: false });
					throw err;
				}
			},

			saveOpportunity: async (opportunity) => {
				set({ loading: true, error: null });
				try {
					// If opportunity was previously rejected, remove it from rejected list
					if (get().rejectedOpportunities.some((opp) => opp.noticeId === opportunity.noticeId)) {
						set((state) => ({
							rejectedOpportunities: state.rejectedOpportunities.filter(
								(opp) => opp.noticeId !== opportunity.noticeId
							),
						}));
					}

					const savedOpp = {
						...opportunity,
						savedAt: new Date().toISOString(),
						status: "saved",
					};

					// Save to database
					const response = await client.models.Opportunity.create({
						opportunityId: opportunity.noticeId,
						title: opportunity.title,
						description: opportunity.description || "",
						agency: opportunity.department,
						dueDate: opportunity.responseDeadLine,
						status: "SAVED",
						bidProgress: 0,
						notes: "",
						attachments: [],
					});

					if (!response?.data) {
						throw new Error("Failed to save opportunity to database");
					}

					set((state) => ({
						savedOpportunities: [...state.savedOpportunities, savedOpp],
						opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
						loading: false,
						error: null,
					}));

					return response.data;
				} catch (err) {
					console.error("Error saving opportunity:", err);
					set({ error: err.message, loading: false });
					throw err;
				}
			},

			rejectOpportunity: async (opportunity) => {
				set({ loading: true, error: null });
				try {
					// If opportunity was previously saved, remove it from database and saved list
					if (get().savedOpportunities.some((opp) => opp.noticeId === opportunity.noticeId)) {
						const savedOpp = await client.models.Opportunity.list({
							filter: { opportunityId: { eq: opportunity.noticeId } },
						});

						if (savedOpp?.data?.[0]) {
							await client.models.Opportunity.delete({ id: savedOpp.data[0].id });
						}

						set((state) => ({
							savedOpportunities: state.savedOpportunities.filter(
								(opp) => opp.noticeId !== opportunity.noticeId
							),
						}));
					}

					const rejectedOpp = {
						...opportunity,
						rejectedAt: new Date().toISOString(),
						status: "rejected",
					};

					set((state) => ({
						rejectedOpportunities: [...state.rejectedOpportunities, rejectedOpp],
						opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
						loading: false,
						error: null,
					}));
				} catch (err) {
					console.error("Error rejecting opportunity:", err);
					set({ error: err.message, loading: false });
					throw err;
				}
			},

			moveToSaved: async (opportunity) => {
				set({ loading: true, error: null });
				try {
					// Remove from rejected list
					set((state) => ({
						rejectedOpportunities: state.rejectedOpportunities.filter(
							(opp) => opp.noticeId !== opportunity.noticeId
						),
					}));

					// Save to database
					const response = await client.models.Opportunity.create({
						opportunityId: opportunity.noticeId,
						title: opportunity.title,
						description: opportunity.description || "",
						agency: opportunity.department,
						dueDate: opportunity.responseDeadLine,
						status: "SAVED",
						bidProgress: 0,
						notes: "",
						attachments: [],
					});

					if (!response?.data) {
						throw new Error("Failed to save opportunity to database");
					}

					const savedOpp = {
						...opportunity,
						savedAt: new Date().toISOString(),
						status: "saved",
					};

					set((state) => ({
						savedOpportunities: [...state.savedOpportunities, savedOpp],
						loading: false,
						error: null,
					}));

					return response.data;
				} catch (err) {
					console.error("Error moving opportunity to saved:", err);
					set({ error: err.message, loading: false });
					throw err;
				}
			},

			clearOpportunities: () => {
				set({
					opportunities: [],
					error: null,
					isInitialized: false,
				});
			},

			resetStore: () => {
				set({
					opportunities: [],
					loading: false,
					error: null,
					isInitialized: false,
				});
			},
		}),
		{
			name: "opportunity-storage",
			partialize: (state) => ({
				savedOpportunities: state.savedOpportunities,
				rejectedOpportunities: state.rejectedOpportunities,
				lastRetrievedDate: state.lastRetrievedDate,
			}),
		}
	)
);
