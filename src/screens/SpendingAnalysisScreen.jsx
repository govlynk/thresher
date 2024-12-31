import React from "react";
import { Box, Grid, Paper, Typography, Alert, CircularProgress } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useSpendingReportsQuery } from "../utils/useSpendingReportsQuery";
import { SpendingOverview } from "../components/spending/SpendingOverview";
import { AgencyChart } from "../components/spending/charts/AgencyChart";
import { NaicsChart } from "../components/spending/charts/NaicsChart";

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
				<Alert severity='info'>No NAICS codes found for this company.</Alert>
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

			<SpendingOverview data={data?.spendingData} company={activeCompanyData} />

			<Grid container spacing={3} sx={{ mt: 3 }}>
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: 400 }}>
						<Typography variant='h6' gutterBottom>
							Agency Spending Distribution
						</Typography>
						<Box sx={{ height: 350, width: "100%", position: "relative" }}>
							<AgencyChart data={data?.agencySpending} />
						</Box>
					</Paper>
				</Grid>

				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: 400 }}>
						<Typography variant='h6' gutterBottom>
							NAICS Spending
						</Typography>
						<Box sx={{ height: 350, width: "100%", position: "relative" }}>
							<NaicsChart data={data?.naicsSpending} />
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
