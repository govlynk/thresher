import React, { useState } from "react";
import { Box, Grid, Paper, CircularProgress, Alert } from "@mui/material";
import { AgencyTreemap } from "../components/agency/charts/AgencyTreemap";
import { useAgencyData } from "../hooks/useAgencyData";

export function AgencyTreemapScreen() {
	const { data, isLoading, error } = useAgencyData(selectedAgency?.toptier_code, fiscalYear);
	console.log("Agency data:", data);
	console.log("Budgetary resources:", data?.obligations_data);

	if (error) {
		return (
			<Alert severity='error' sx={{ mb: 3 }}>
				{error.message || "Failed to load agency data"}
			</Alert>
		);
	}

	return (
		<Box>
			{isLoading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
					<CircularProgress />
				</Box>
			) : selectedAgency ? (
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 3, height: "400px" }}>
							<AgencyTreemap data={data} />
						</Paper>
					</Grid>
				</Grid>
			) : (
				<Alert severity='info'>Please select an agency to view detailed analysis</Alert>
			)}
		</Box>
	);
}
