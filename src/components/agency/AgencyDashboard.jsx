import React, { useState } from "react";
import { Box, Grid, Paper, CircularProgress, Alert } from "@mui/material";
import { AgencySelector } from "./AgencySelector";
import { ContractSpendingChart } from "./charts/ContractSpendingChart";
import { IdvSpendingChart } from "./charts/IdvSpendingChart";
import { ObligationsByCategoryChart } from "./charts/ObligationsByCategoryChart";
import { AgencyTreemap } from "./charts/AgencyTreemap";
import { AwardMetrics } from "./AwardMetrics";
import { AgencyOverview } from "./AgencyOverview";
import { useAgencyData } from "../../hooks/useAgencyData";
import { FiscalYearFilter } from "./filters/FiscalYearFilter";

export function AgencyDashboard() {
	const [selectedAgency, setSelectedAgency] = useState(null);
	const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());

	const { data, isLoading, error } = useAgencyData(selectedAgency?.toptier_code, fiscalYear);
	console.log("Agency data:", data);
	console.log("Budgetary resources:", data?.budgetary_resources);

	if (error) {
		return (
			<Alert severity='error' sx={{ mb: 3 }}>
				{error.message || "Failed to load agency data"}
			</Alert>
		);
	}

	return (
		<Box>
			<Box sx={{ mb: 4, display: "flex", gap: 2 }}>
				<AgencySelector value={selectedAgency} onChange={setSelectedAgency} />
				<FiscalYearFilter value={fiscalYear} onChange={setFiscalYear} />
			</Box>

			{isLoading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
					<CircularProgress />
				</Box>
			) : selectedAgency ? (
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<AgencyOverview data={data?.agency_overview} />
					</Grid>
					<Grid item xs={12}>
						<AwardMetrics awardCounts={data?.award_counts} budgetaryResources={data?.budgetary_resources} />
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 3, height: "400px" }}>
							<ContractSpendingChart data={data?.contract_spending} />
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 3, height: "400px" }}>
							<IdvSpendingChart data={data?.idv_spending} />
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 3, height: "400px" }}>
							<ObligationsByCategoryChart data={data?.obligations_by_category} />
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 3, height: "400px" }}>
							<AgencyTreemap fiscalYear={fiscalYear} />
						</Paper>
					</Grid>
				</Grid>
			) : (
				<Alert severity='info'>Please select an agency to view detailed analysis</Alert>
			)}
		</Box>
	);
}
