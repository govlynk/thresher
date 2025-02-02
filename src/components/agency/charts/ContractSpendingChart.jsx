import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, Typography, useTheme } from "@mui/material";
import { formatBillions } from "../../../utils/formatters";

export function ContractSpendingChart({ data = [] }) {
	const theme = useTheme();

	if (!data?.length) {
		return (
			<Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
				<Typography color='text.secondary'>No contract spending data available</Typography>
			</Box>
		);
	}

	const chartData = data.slice(0, 5).map((item) => ({
		name: item.name,
		Obligations: item.total_obligations || 0,
	}));

	return (
		<Box sx={{ height: "100%" }}>
			<Typography variant='h6' gutterBottom>
				Top 5 Contract Spending by Sub-Agency
			</Typography>
			<Box sx={{ height: "calc(100% - 32px)", width: "100%" }}>
				<ResponsiveBar
					data={chartData}
					keys={["Obligations"]}
					indexBy='name'
					margin={{ top: 20, right: 30, bottom: 70, left: 80 }}
					padding={0.3}
					valueScale={{ type: "linear" }}
					indexScale={{ type: "band", round: true }}
					valueFormat={formatBillions}
					colors={{ scheme: "nivo" }}
					theme={{
						axis: {
							ticks: {
								text: {
									fill: theme.palette.text.secondary,
									fontSize: 11,
									angle: -45,
									textAnchor: "end",
								},
							},
						},
						tooltip: {
							container: {
								background: theme.palette.background.paper,
								color: theme.palette.text.primary,
							},
						},
					}}
					axisBottom={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: -45,
					}}
					axisLeft={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						format: formatBillions,
					}}
					labelSkipWidth={12}
					labelSkipHeight={12}
				/>
			</Box>
		</Box>
	);
}
