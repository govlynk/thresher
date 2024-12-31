import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, useTheme } from "@mui/material";
import { formatBillions } from "../../../utils/formatters";

export function NaicsChart({ data = [] }) {
	const theme = useTheme();

	const chartData = useMemo(
		() =>
			data?.results?.map((item) => ({
				naics: `${item.code} - ${item.name}`,
				amount: item.amount,
			})) || [],
		[data]
	);

	const chartTheme = useMemo(
		() => ({
			fontSize: 11,
			textColor: theme.palette.text.secondary,
			axis: {
				ticks: {
					text: {
						fill: theme.palette.text.secondary,
					},
				},
			},
			tooltip: {
				container: {
					background: theme.palette.background.paper,
					color: theme.palette.text.primary,
					fontSize: "12px",
				},
			},
		}),
		[theme]
	);

	return (
		<Box sx={{ width: "100%", height: "100%", position: "absolute" }}>
			<ResponsiveBar
				data={chartData}
				keys={["amount"]}
				indexBy='naics'
				margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
				padding={0.3}
				valueFormat={formatBillions}
				theme={chartTheme}
				animate={false}
				isInteractive={true}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: -45,
					tickColor: theme.palette.text.secondary,
				}}
				axisLeft={{
					format: formatBillions,
					tickColor: theme.palette.text.secondary,
				}}
				labelSkipWidth={12}
				labelSkipHeight={12}
				colors={{ scheme: "nivo" }}
			/>
		</Box>
	);
}
