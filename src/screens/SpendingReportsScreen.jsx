import React, { useEffect } from "react";
import { Box, Typography, Alert, CircularProgress, Grid, Paper } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useSpendingReportsQuery } from "../utils/useSpendingReportsQuery";
import NaicsSpendingChart from "../components/spending/reports/NaicsSpendingChart";
import AgencySpendingChart from "../components/spending/reports/AgencySpendingChart";
import GeographicSpendingMap from "../components/spending/reports/GeographicSpendingMap";

export default function SpendingReportsScreen() {
	// Get both the active company ID and data using separate selectors
	const activeCompanyId = useGlobalStore((state) => state.activeCompanyId);
	const activeCompanyData = useGlobalStore((state) => state.activeCompanyData);
	const getActiveCompany = useGlobalStore((state) => state.getActiveCompany);

	// Effect to log store state for debugging
	useEffect(() => {
		console.log("[SpendingReportsScreen] Active Company ID:", activeCompanyId);
		console.log("[SpendingReportsScreen] Active Company Data:", activeCompanyData);
		const company = getActiveCompany();
		console.log("[SpendingReportsScreen] Get Active Company Result:", company);
	}, [activeCompanyId, activeCompanyData, getActiveCompany]);

	// Get spending data
	const { data, isLoading, error } = useSpendingReportsQuery(activeCompanyData);

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view spending reports.</Alert>
			</Box>
		);
	}

	if (!activeCompanyData) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Loading company data...</Alert>
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
				<Alert severity='error'>{error.message || "Failed to fetch spending data"}</Alert>
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
						<NaicsSpendingChart data={data?.naicsSpending} />
					</Paper>
				</Grid>

				{/* Agency Spending */}
				<Grid item xs={12} lg={6}>
					<Paper sx={{ p: 3, height: "100%" }}>
						<Typography variant='h6' gutterBottom>
							Agency-Specific Contracting
						</Typography>
						<AgencySpendingChart data={data?.agencySpending} />
					</Paper>
				</Grid>

				{/* Geographic Spending Map */}
				<Grid item xs={12}>
					<Paper sx={{ p: 3 }}>
						<Typography variant='h6' gutterBottom>
							Geographic Spending Distribution
						</Typography>
						<GeographicSpendingMap data={data?.geographicSpending} />
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
