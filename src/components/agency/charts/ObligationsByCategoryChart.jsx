import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";
import { formatBillions } from "../../../utils/formatters";

export function ObligationsByCategoryChart({ data = [] }) {
	const theme = useTheme();
	console.log("Obligations data:", data); // Debug log

	if (!data?.length) {
		return (
			<Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
				<Typography color='text.secondary'>No obligations data available</Typography>
			</Box>
		);
	}

	// Transform data for the pie chart
	const chartData = data
		.filter((item) => item.aggregated_amount > 0) // Only show categories with values
		.map((item) => ({
			id: item.category,
			label: item.category,
			value: item.aggregated_amount,
		}));

	return (
		<Box sx={{ height: "100%" }}>
			<Typography variant='h6' gutterBottom>
				Obligations by Award Category
			</Typography>
			<Box sx={{ height: "calc(100% - 32px)", width: "100%", position: "relative" }}>
				<ResponsivePie
					data={chartData}
					margin={{ top: 40, right: 140, bottom: 80, left: 80 }}
					innerRadius={0.5}
					padAngle={0.7}
					cornerRadius={3}
					activeOuterRadiusOffset={8}
					valueFormat={formatBillions}
					colors={{ scheme: "category10" }}
					theme={{
						tooltip: {
							container: {
								background: theme.palette.background.paper,
								color: theme.palette.text.primary,
								fontSize: "12px",
								boxShadow: theme.shadows[3],
							},
						},
						labels: {
							text: {
								fill: theme.palette.text.primary,
								fontSize: "11px",
							},
						},
					}}
					arcLinkLabelsSkipAngle={10}
					arcLinkLabelsTextColor={theme.palette.text.secondary}
					arcLinkLabelsThickness={2}
					arcLinkLabelsDiagonalLength={36}
					arcLinkLabelsTextOffset={6}
					arcLinkLabelsColor={{ from: "color" }}
					arcLabelsSkipAngle={10}
					arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
					legends={[
						{
							anchor: "right",
							direction: "column",
							justify: false,
							translateX: 100,
							translateY: 0,
							itemsSpacing: 2,
							itemWidth: 100,
							itemHeight: 20,
							itemTextColor: theme.palette.text.secondary,
							itemDirection: "left-to-right",
							itemOpacity: 1,
							symbolSize: 18,
							symbolShape: "circle",
							effects: [
								{
									on: "hover",
									style: {
										itemTextColor: theme.palette.text.primary,
									},
								},
							],
						},
					]}
				/>
			</Box>
		</Box>
	);
}
