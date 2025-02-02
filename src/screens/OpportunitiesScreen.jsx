import React, { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, Alert, Paper, Container, useTheme } from "@mui/material";
import { Building2 } from "lucide-react";
import { OpportunityList } from "../components/opportunities/OpportunityList";
import { OpportunitySearch } from "../components/opportunities/OpportunitySearch";
import { OpportunityFilters } from "../components/opportunities/OpportunityFilters";
import { useOpportunityStore } from "../stores/opportunityStore";
import { useGlobalStore } from "../stores/globalStore";
import { getDefaultStartDate, getDefaultEndDate } from "../utils/opportunityDateUtils";

import { useQueryClient } from "@tanstack/react-query";

export default function OpportunitiesScreen() {
	const { activeCompanyId, activeCompanyData } = useGlobalStore();
	const theme = useTheme();
	const [activeTab, setActiveTab] = useState(0);
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();

	const initialFilters = {
		naicsCodes: activeCompanyData?.naicsCode || [],
		agency: "",
		typeOfSetAside: "",
		responseDateFrom: getDefaultStartDate(),
		responseDateTo: getDefaultEndDate(),
	};

	const [filters, setFilters] = useState(initialFilters);

	const [sortConfig, setSortConfig] = useState({
		field: "responseDeadLine",
		direction: "asc",
	});

	const {
		opportunities,
		savedOpportunities,
		rejectedOpportunities,
		error,
		initializeStore,
		saveOpportunity,
		rejectOpportunity,
		moveToSaved,
		resetStore,
	} = useOpportunityStore();

	useEffect(() => {
		if (activeCompanyId) {
			initializeStore();
		}
		return () => {
			// Clean up by resetting opportunities
			useOpportunityStore.getState().setOpportunities([]);
		};
	}, [activeCompanyId]);

	// Update filters when company data changes
	useEffect(() => {
		if (activeCompanyData?.naicsCode) {
			setFilters((prev) => ({ ...prev, naicsCodes: activeCompanyData.naicsCode }));
		}
	}, [activeCompanyData]);

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const handleFilterChange = (field, value) => {
		setFilters((prev) => ({ ...prev, [field]: value }));
	};

	const handleSortChange = (config) => {
		setSortConfig(config);
	};

	const filterOpportunities = (opps) => {
		return opps.filter((opp) => {
			// If no NAICS codes selected, show all opportunities
			if (!filters.naicsCodes?.length) {
				return true;
			}

			// Check if opportunity has any matching NAICS code
			const oppNaicsCodes = Array.isArray(opp.naicsCodes)
				? opp.naicsCodes
				: typeof opp.naicsCode === "string"
				? opp.naicsCode.split(",")
				: [];

			console.log("Filtering opportunity:", {
				opportunityId: opp.noticeId,
				oppNaicsCodes,
				filterNaicsCodes: filters.naicsCodes,
			});

			// Return true if any of the opportunity's NAICS codes match any of the filter codes
			const matchesNaics =
				!filters.naicsCodes.length || // Show all if no NAICS filters
				filters.naicsCodes.some((filterCode) =>
					oppNaicsCodes.some((oppCode) => oppCode.trim() === filterCode.trim())
				);

			const matchesAgency = !filters.agency || opp.agency === filters.agency;
			const matchesSetAside = !filters.typeOfSetAside || opp.typeOfSetAside === filters.typeOfSetAside;

			const responseDate = new Date(opp.responseDeadLine);
			const matchesDateRange =
				(!filters.responseDateFrom || responseDate >= filters.responseDateFrom) &&
				(!filters.responseDateTo || responseDate <= filters.responseDateTo);

			return matchesNaics && matchesAgency && matchesSetAside && matchesDateRange;
		});
	};

	const sortOpportunities = (opps) => {
		if (!sortConfig.field) return opps;

		return [...opps].sort((a, b) => {
			const aValue = a[sortConfig.field];
			const bValue = b[sortConfig.field];

			if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
			if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
	};

	const getFilteredAndSortedOpportunities = (opps) => {
		const filtered = filterOpportunities(opps);
		return sortOpportunities(filtered);
	};

	const handleSaveOpportunity = async (opportunity) => {
		setLoading(true);
		try {
			// Optimistic update
			queryClient.setQueryData(["opportunities"], (old) =>
				old?.filter((opp) => opp.noticeId !== opportunity.noticeId)
			);
			queryClient.setQueryData(["savedOpportunities"], (old) => [
				...(old || []),
				{ ...opportunity, status: "BACKLOG" },
			]);

			const result = await saveOpportunity(opportunity);

			// Refresh the lists
			await Promise.all([
				queryClient.invalidateQueries(["opportunities"]),
				queryClient.invalidateQueries(["savedOpportunities"]),
			]);
		} catch (err) {
			// Revert on error
			queryClient.invalidateQueries(["opportunities"]);
			queryClient.invalidateQueries(["savedOpportunities"]);
			console.error("Error saving opportunity:", err);
		} finally {
			console.log("Save opportunity done", opportunities);
			setLoading(false);
		}
	};

	const handleRejectOpportunity = async (opportunity) => {
		setLoading(true);
		try {
			// Optimistic update
			queryClient.setQueryData(["opportunities"], (old) =>
				old?.filter((opp) => opp.noticeId !== opportunity.noticeId)
			);
			queryClient.setQueryData(["rejectedOpportunities"], (old) => [
				...(old || []),
				{ ...opportunity, status: "REJECTED" },
			]);

			const result = await rejectOpportunity(opportunity);

			// Refresh the lists
			await Promise.all([
				queryClient.invalidateQueries(["opportunities"]),
				queryClient.invalidateQueries(["rejectedOpportunities"]),
			]);
		} catch (err) {
			// Revert on error
			queryClient.invalidateQueries(["opportunities"]);
			queryClient.invalidateQueries(["rejectedOpportunities"]);
			console.error("Error rejecting opportunity:", err);
		} finally {
			setLoading(false);
		}
	};

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view opportunities</Alert>
			</Box>
		);
	}

	return (
		<Container maxWidth={false} sx={{ py: 4 }}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 2,
					mb: 3,
					px: 2,
				}}
			>
				<Building2 size={32} color={theme.palette.primary.main} />
				<Typography variant='h4' sx={{ fontWeight: "bold" }}>
					Contract Opportunities
				</Typography>
			</Box>

			<Box sx={{ mb: 3 }}>
				{console.log("OpportunitiesScreen - Rendering OpportunitySearch")}
				<OpportunitySearch />
			</Box>

			<Tabs
				value={activeTab}
				onChange={handleTabChange}
				sx={{
					mb: 2,
					px: 2,
					"& .MuiTab-root": {
						minWidth: 120,
						fontWeight: 500,
					},
					"& .Mui-selected": {
						color: theme.palette.primary.main,
					},
				}}
			>
				<Tab label={`New (${opportunities.length})`} id='opportunities-tab-0' />
				<Tab label={`Saved (${savedOpportunities.length})`} id='opportunities-tab-1' />
				<Tab label={`Rejected (${rejectedOpportunities.length})`} id='opportunities-tab-2' />
			</Tabs>

			<Paper
				elevation={0}
				sx={{
					mb: 3,
					borderRadius: 2,
					bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
					p: 2,
				}}
			>
				<OpportunityFilters
					filters={filters}
					onFilterChange={handleFilterChange}
					sortConfig={sortConfig}
					onSortChange={handleSortChange}
					naicsCodes={activeCompanyData?.naicsCode || []}
					agencies={[
						...(activeTab === 0 ? opportunities : activeTab === 1 ? savedOpportunities : rejectedOpportunities),
					]
						.map((opp) => opp.agency)
						.filter((agency, index, self) => agency && self.indexOf(agency) === index)}
					setAsideTypes={[
						...(activeTab === 0 ? opportunities : activeTab === 1 ? savedOpportunities : rejectedOpportunities),
					]
						.map((opp) => opp.typeOfSetAside)
						.filter((type, index, self) => type && self.indexOf(type) === index)}
				/>
			</Paper>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<Box role='tabpanel' hidden={activeTab !== 0}>
				{activeTab === 0 && (
					<OpportunityList
						opportunities={getFilteredAndSortedOpportunities(opportunities)}
						type='new'
						onSave={handleSaveOpportunity}
						onReject={handleRejectOpportunity}
						loading={loading}
					/>
				)}
			</Box>

			<Box role='tabpanel' hidden={activeTab !== 1}>
				{activeTab === 1 && (
					<OpportunityList
						opportunities={getFilteredAndSortedOpportunities(savedOpportunities)}
						type='saved'
						loading={loading}
					/>
				)}
			</Box>

			<Box role='tabpanel' hidden={activeTab !== 2}>
				{activeTab === 2 && (
					<OpportunityList
						opportunities={getFilteredAndSortedOpportunities(rejectedOpportunities)}
						type='rejected'
						onMoveToSaved={moveToSaved}
						loading={loading}
					/>
				)}
			</Box>
		</Container>
	);
}
