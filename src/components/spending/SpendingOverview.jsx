import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { TrendingUp, Building2, Award, DollarSign } from "lucide-react";
import { formatBillions } from "../../utils/formatters";

export function SpendingOverview({ data, company }) {
	const totalSpending = data?.results?.reduce((sum, award) => sum + (award.amount || 0), 0) || 0;
	const averageAwardSize = totalSpending / (data?.results?.length || 1);
	const uniqueAgencies = new Set(data?.results?.map((award) => award.name)).size || 0;

	const metrics = [
		{
			title: "Total Contract Value",
			value: formatBillions(totalSpending),
			icon: DollarSign,
			color: "success.main",
		},
		{
			title: "Average Award Size",
			value: formatBillions(averageAwardSize),
			icon: TrendingUp,
			color: "primary.main",
		},
		{
			title: "Total Awards",
			value: data?.results?.length || 0,
			icon: Award,
			color: "warning.main",
		},
		{
			title: "Unique Agencies",
			value: uniqueAgencies,
			icon: Building2,
			color: "info.main",
		},
	];

	return (
		<Grid container spacing={3}>
			{metrics.map((metric) => (
				<Grid item xs={12} sm={6} md={3} key={metric.title}>
					<Paper sx={{ p: 3 }}>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<Box sx={{ p: 1, borderRadius: 1, bgcolor: `${metric.color}15`, color: metric.color }}>
								<metric.icon size={20} />
							</Box>
						</Box>
						<Typography variant='h5' sx={{ fontWeight: "bold" }}>
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
