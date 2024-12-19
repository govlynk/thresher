import React from "react";
import { Box, Typography, Alert, CircularProgress, Grid, Paper } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useSpendingReportsQuery } from "../utils/useSpendingReportsQuery";
import NaicsSpendingChart from "../components/spending/reports/NaicsSpendingChart";
import AgencySpendingChart from "../components/spending/reports/AgencySpendingChart";
import GeographicSpendingMap from "../components/spending/reports/GeographicSpendingMap";

export default function SpendingReportsScreen() {
	// Get active company data from global store with loading state
	const { activeCompanyId, activeCompanyData } = useGlobalStore();
	const [isInitializing, setIsInitializing] = React.useState(true);

	// Handle initial loading state
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setIsInitializing(false);
		}, 1000); // Give store time to initialize

		return () => clearTimeout(timer);
	}, []);

	// Show loading state during initial store load
	if (isInitializing) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
				<CircularProgress />
			</Box>
		);
	}

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

	// Now we can safely use the spending reports query
	const { data: reportsData, isLoading, error } = useSpendingReportsQuery(activeCompanyData);

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
				<Alert severity='error'>
					{error instanceof Error ? error.message : "Failed to fetch spending reports data"}
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
