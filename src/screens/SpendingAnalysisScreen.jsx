import React from "react";
import { Box, Typography, Alert, CircularProgress, Grid, Paper } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useSpendingReportsQuery } from "../utils/useSpendingReportsQuery";
import SpendingOverview from "../components/spending/SpendingOverview";
import AgencyBreakdown from "../components/spending/AgencyBreakdown";
import SpendingTimeline from "../components/spending/SpendingTimeline";
import NaicsSpendingChart from "../components/spending/reports/NaicsSpendingChart";
import AgencySpendingChart from "../components/spending/reports/AgencySpendingChart";
import GeographicSpendingMap from "../components/spending/reports/GeographicSpendingMap";

export default function SpendingAnalysisScreen() {
	const { activeCompanyData } = useGlobalStore();
	const { data, isLoading, error } = useSpendingReportsQuery(activeCompanyData);

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

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='error'>{error?.message || "Failed to fetch spending data"}</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Federal Spending Analysis
			</Typography>

			<Grid container spacing={3}>
				{/* Overview Section */}
				<Grid item xs={12}>
					<SpendingOverview data={data?.spendingData} company={activeCompanyData} />
				</Grid>

				{/* Agency Breakdown */}
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: "100%", minHeight: 400 }}>
						<Typography variant='h6' gutterBottom>
							Agency Spending Distribution
						</Typography>
						<Box sx={{ height: 350 }}>
							<AgencySpendingChart data={data?.agencySpending} />
						</Box>
					</Paper>
				</Grid>

				{/* Timeline */}
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: "100%", minHeight: 400 }}>
						<Typography variant='h6' gutterBottom>
							Spending Timeline
						</Typography>
						<Box sx={{ height: 350 }}>
							<SpendingTimeline data={data?.spendingData} />
						</Box>
					</Paper>
				</Grid>

				{/* NAICS Spending */}
				<Grid item xs={12}>
					<Paper sx={{ p: 3, minHeight: 400 }}>
						<Typography variant='h6' gutterBottom>
							Spending by NAICS Codes
						</Typography>
						<Box sx={{ height: 350 }}>
							<NaicsSpendingChart data={data?.naicsSpending} />
						</Box>
					</Paper>
				</Grid>

				{/* Geographic Distribution */}
				<Grid item xs={12}>
					<Paper sx={{ p: 3, minHeight: 400 }}>
						<Typography variant='h6' gutterBottom>
							Geographic Distribution
						</Typography>
						<Box sx={{ height: 350 }}>
							<GeographicSpendingMap data={data?.geographicSpending} />
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
