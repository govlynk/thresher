import React from "react";
import { Box, Paper, CircularProgress, Alert, Typography, useTheme } from "@mui/material";
import { AgencyTreemap } from "../components/agency/charts/AgencyTreemap";
import { useAgencySpending } from "../hooks/useAgencyData";
import { formatCurrency } from "../utils/formatters";

export default function AgencyTreemapScreen() {
	const theme = useTheme();
	const { data, isLoading, error } = useAgencySpending();
	console.log("AgencyTreemapScreen data:", data); // Debug log
	// Process data for treemap
	const treemapData = React.useMemo(() => {
		if (!data?.results) return null;

		// Sort children by amount descending
		const children = data.results.map((agency) => ({
			id: agency.code,
			name: agency.name,
			value: agency.amount,
			formattedValue: formatCurrency(agency.amount),
			percentage: agency.percentage,
			sortIndex: agency.sortIndex || 0,
		}));

		return {
			name: `FY ${data.fiscalYear} Agency Spending`,
			children,
		};
	}, [data]);

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h5' sx={{ mb: 1 }}>
				You are viewing FY 2025 spending by Agency
			</Typography>
			<Typography variant='body2' sx={{ mb: 3, color: "text.secondary" }}>
				Choose an agency below to start your exploration.
			</Typography>

			{!isLoading && !error && data?.total && (
				<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
					<Typography variant='h6' sx={{ color: "primary.main" }}>
						FY 2025 OBLIGATED AMOUNT
						<Box component='span' sx={{ display: "block", textAlign: "right" }}>
							{formatCurrency(data.total)}
						</Box>
					</Typography>
				</Box>
			)}

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error.message || "Failed to load agency spending data"}
				</Alert>
			)}

			<Paper sx={{ p: 3, height: "75vh" }}>
				{isLoading ? (
					<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
						<CircularProgress />
					</Box>
				) : !treemapData ? (
					<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
						<Typography color='text.secondary'>No spending data available</Typography>
					</Box>
				) : (
					<AgencyTreemap data={treemapData} />
				)}
			</Paper>
		</Box>
	);
}
