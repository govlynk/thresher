import React, { useEffect } from "react";
import { Box, Typography, Tabs, Tab, Alert, CircularProgress } from "@mui/material";
import { OpportunityList } from "../components/opportunities/OpportunityList";
import { OpportunitySearch } from "../components/opportunities/OpportunitySearch";
import { useOpportunityStore } from "../stores/opportunityStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";
import { getOpportunity } from "../utils/opportunityApi";

export default function OpportunitiesScreen() {
	const [activeTab, setActiveTab] = React.useState(0);
	const {
		opportunities,
		savedOpportunities,
		rejectedOpportunities,
		loading,
		error,
		setOpportunities,
		initializeStore,
		resetStore,
	} = useOpportunityStore();

	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	// Initialize store and fetch data when component mounts
	useEffect(() => {
		const initializeData = async () => {
			if (!activeCompany?.id) return;

			try {
				// First initialize the store to get saved/rejected opportunities
				await initializeStore();

				// Then fetch new opportunities from SAM.gov
				if (activeCompany.naicsCode?.length) {
					const date = new Date();
					const endDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
					const startDate = `${date.getMonth() - 2}/01/${date.getFullYear()}`;

					const searchParams = {
						naicsCode: activeCompany.naicsCode.join(","),
						postedFrom: startDate,
						postedTo: endDate,
						limit: "100",
					};

					const newOpportunities = await getOpportunity(searchParams);
					setOpportunities(newOpportunities);
				}
			} catch (err) {
				console.error("Error initializing opportunities:", err);
			}
		};

		initializeData();

		// Cleanup on unmount
		return () => {
			resetStore();
		};
	}, [activeCompany?.id, initializeStore, resetStore, setOpportunities]);

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	if (!activeCompany) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view opportunities</Alert>
			</Box>
		);
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Contract Opportunities
			</Typography>

			<OpportunitySearch />

			<Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
				<Tab label={`New (${opportunities.length})`} id='opportunities-tab-0' />
				<Tab label={`Saved (${savedOpportunities.length})`} id='opportunities-tab-1' />
				<Tab label={`Rejected (${rejectedOpportunities.length})`} id='opportunities-tab-2' />
			</Tabs>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<Box role='tabpanel' hidden={activeTab !== 0}>
				{activeTab === 0 && <OpportunityList opportunities={opportunities} type='new' />}
			</Box>

			<Box role='tabpanel' hidden={activeTab !== 1}>
				{activeTab === 1 && <OpportunityList opportunities={savedOpportunities} type='saved' />}
			</Box>

			<Box role='tabpanel' hidden={activeTab !== 2}>
				{activeTab === 2 && <OpportunityList opportunities={rejectedOpportunities} type='rejected' />}
			</Box>
		</Box>
	);
}
