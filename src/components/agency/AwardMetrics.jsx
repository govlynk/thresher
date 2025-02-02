import React, { useMemo } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { Award, DollarSign, BarChart3, TrendingUp } from "lucide-react";
import { formatBillions } from "../../utils/formatters";

export function AwardMetrics({ awardCounts, budgetaryResources = {} }) {
	// console.log("Raw budgetary resources:", budgetaryResources);

	const currentYearData = useMemo(() => {
		if (!budgetaryResources?.agency_data_by_year?.length) {
			console.log("No agency data by year found");
			return null;
		}

		// Sort by fiscal year descending and get the most recent year
		const data = budgetaryResources.agency_data_by_year.sort((a, b) => b.fiscal_year - a.fiscal_year)[0];

		console.log("Current year data:", data);
		return data;
	}, [budgetaryResources]);

	const metrics = [
		{
			title: "Total Awards",
			value: formatBillions(awardCounts) || 0,
			icon: Award,
			color: "primary.main",
		},
		{
			title: "Total Budgetary Resources",
			value: formatBillions(currentYearData?.agency_budgetary_resources || 0),
			icon: DollarSign,
			color: "success.main",
		},
		{
			title: "Total Obligations",
			value: formatBillions(currentYearData?.agency_total_obligated || 0),
			icon: BarChart3,
			color: "warning.main",
		},
		{
			title: "Total Available Resources",
			value: formatBillions(currentYearData?.total_budgetary_resources || 0),
			icon: TrendingUp,
			color: "info.main",
		},
	];

	// console.log("Metrics:", metrics);

	return (
		<Grid container spacing={3}>
			{metrics.map((metric) => (
				<Grid item xs={12} sm={6} md={3} key={metric.title}>
					<Paper
						sx={{
							p: 3,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							textAlign: "center",
						}}
					>
						<Box
							sx={{
								p: 1,
								borderRadius: 2,
								bgcolor: `${metric.color}15`,
								color: metric.color,
								mb: 2,
							}}
						>
							<metric.icon size={24} />
						</Box>
						<Typography variant='h4' sx={{ mb: 1, fontWeight: "bold" }}>
							{metric.value}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{metric.title}
						</Typography>
					</Paper>
				</Grid>
			))}
		</Grid>
	);
}
