import React from "react";
import { Box, Typography, Alert, CircularProgress, Grid, Paper } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useSpendingReportsQuery } from "../utils/useSpendingReportsQuery";
import NaicsSpendingChart from "../components/spending/reports/NaicsSpendingChart";
import AgencySpendingChart from "../components/spending/reports/AgencySpendingChart";
import GeographicSpendingMap from "../components/spending/reports/GeographicSpendingMap";
import CompetitorAnalysis from "../components/spending/reports/CompetitorAnalysis";
import VendorPerformance from "../components/spending/reports/VendorPerformance";
import SubcontractingOpportunities from "../components/spending/reports/SubcontractingOpportunities";

export default function SpendingReportsScreen() {
	const { activeCompanyId, activeCompanyData } = useGlobalStore.getState();

	const {
		data: reportsData,
		isLoading: reportsLoading,
		error: reportsError,
	} = useSpendingReportsQuery(activeCompanyData);

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view spending reports.</Alert>
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

	if (reportsLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (reportsError) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='error'>{reportsError?.message || "Failed to fetch spending reports data"}</Alert>
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

				{/* Competitor Analysis */}
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: "100%" }}>
						<Typography variant='h6' gutterBottom>
							Competitor Analysis
						</Typography>
						<CompetitorAnalysis data={reportsData?.competitorData} />
					</Paper>
				</Grid>

				{/* Vendor Performance */}
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: "100%" }}>
						<Typography variant='h6' gutterBottom>
							Vendor Performance Metrics
						</Typography>
						<VendorPerformance data={reportsData?.vendorPerformance} />
					</Paper>
				</Grid>

				{/* Subcontracting Opportunities */}
				<Grid item xs={12}>
					<Paper sx={{ p: 3 }}>
						<Typography variant='h6' gutterBottom>
							Subcontracting Opportunities
						</Typography>
						<SubcontractingOpportunities data={reportsData?.subcontractingData} />
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
