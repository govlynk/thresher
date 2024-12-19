import React, { useEffect } from "react";
import { Box, Typography, Alert, CircularProgress, Grid, Paper } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useSpendingReportsQuery } from "../utils/useSpendingReportsQuery";
import NaicsSpendingChart from "../components/spending/reports/NaicsSpendingChart";
import AgencySpendingChart from "../components/spending/reports/AgencySpendingChart";
import GeographicSpendingMap from "../components/spending/reports/GeographicSpendingMap";

export default function SpendingReportsScreen() {
	// Get active company data from global store with loading state
	const { activeCompanyId, activeCompanyData } = useGlobalStore();
	const { reportsData, isLoading, error } = useSpendingReportsQuery(activeCompanyData);

	useEffect(() => {
		if (activeCompanyData?.uei) {
			console.log("Fetching Spending for company:", activeCompanyData.uei);
			// Now we can safely use the spending reports query
		}
	}, [activeCompanyData?.uei]);

	// Early return if no company is selected
	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view spending reports.</Alert>
			</Box>
		);
	}

	// Early return if company data is not loaded
	if (!activeCompanyData) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='info'>Loading company data...</Alert>
			</Box>
		);
	}

	// Early return if company has no NAICS codes
	if (!activeCompanyData.naicsCode?.length) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='info'>
					No NAICS codes found for this company. NAICS codes are required for spending analysis.
				</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Federal Spending Reports
			</Typography>

			<Grid container spacing={3}>
				{/* NAICS Spending Analysis */}
				<Grid item xs={12} lg={6}>
					<Paper sx={{ p: 3, height: "100%" }}>
						<Typography variant='h6' gutterBottom>
							Spending by NAICS Codes
						</Typography>
						<NaicsSpendingChart data={reportsData?.naicsSpending} />
					</Paper>
				</Grid>

				{/* Agency Spending */}
				<Grid item xs={12} lg={6}>
					<Paper sx={{ p: 3, height: "100%" }}>
						<Typography variant='h6' gutterBottom>
							Agency-Specific Contracting
						</Typography>
						<AgencySpendingChart data={reportsData?.agencySpending} />
					</Paper>
				</Grid>

				{/* Geographic Spending Map */}
				<Grid item xs={12}>
					<Paper sx={{ p: 3 }}>
						<Typography variant='h6' gutterBottom>
							Geographic Spending Distribution
						</Typography>
						<GeographicSpendingMap data={reportsData?.geographicSpending} />
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
