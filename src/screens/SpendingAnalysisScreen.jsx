import React from "react";
import { Box, Typography, Alert, CircularProgress, Grid } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useSpendingQuery, useAwardingAgencyQuery } from "../utils/useSpendingQuery";
import { useSpendingReportsQuery } from "../utils/useSpendingReportsQuery";
import SpendingOverview from "../components/spending/SpendingOverview";
import AgencyBreakdown from "../components/spending/AgencyBreakdown";
import SpendingTimeline from "../components/spending/SpendingTimeline";

export default function SpendingAnalysisScreen() {
	const { activeCompanyId, activeCompanyData } = useGlobalStore();

	const { data: spendingData, isLoading: spendingLoading, error: spendingError } = useSpendingQuery(activeCompanyData);

	const { data: agencyData, isLoading: agencyLoading, error: agencyError } = useAwardingAgencyQuery(activeCompanyData);
	const { data: reportsData, isLoading: naicsLoading, error: naicsError } = useSpendingReportsQuery(activeCompanyData);

	if (!activeCompanyData) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view spending analysis.</Alert>
			</Box>
		);
	}

	if (!activeCompanyData.naicsCode?.length) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='info'>
					No NAICS codes found for this company. NAICS codes are required for spending analysis.
				</Alert>
			</Box>
		);
	}

	if (spendingLoading || agencyLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (spendingError || agencyError) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='error'>
					{spendingError?.message || agencyError?.message || "Failed to fetch spending data"}
				</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Federal Spending Analysis
			</Typography>

			<Grid container spacing={3}>
				<Grid item xs={12}>
					<SpendingOverview data={spendingData} company={activeCompanyData} />
				</Grid>

				<Grid item xs={12} md={6}>
					<AgencyBreakdown data={agencyData} />
				</Grid>

				<Grid item xs={12} md={6}>
					<SpendingTimeline data={spendingData} />
				</Grid>
			</Grid>
		</Box>
	);
}
