import React, { useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, useTheme } from "@mui/material";
import { formatBillions } from "../../../utils/formatters";

export function AgencyChart({ data = [] }) {
	const theme = useTheme();

	const chartData = useMemo(
		() =>
			data?.results?.map((agency) => ({
				id: agency.name,
				label: agency.name,
				value: agency.amount,
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
			<ResponsivePie
				data={chartData}
				margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
				innerRadius={0.5}
				padAngle={0.7}
				cornerRadius={3}
				activeOuterRadiusOffset={8}
				valueFormat={formatBillions}
				arcLinkLabelsSkipAngle={10}
				arcLinkLabelsTextColor={theme.palette.text.secondary}
				arcLabelsSkipAngle={10}
				theme={chartTheme}
				enableArcLabels={false}
				animate={false}
				isInteractive={true}
				colors={{ scheme: "nivo" }}
				borderWidth={1}
				borderColor={{
					from: "color",
					modifiers: [["darker", 0.2]],
				}}
				legends={[
					{
						anchor: "bottom",
						direction: "row",
						translateY: 56,
						itemWidth: 100,
						itemHeight: 18,
						symbolSize: 18,
						symbolShape: "circle",
						itemTextColor: theme.palette.text.secondary,
						itemDirection: "left-to-right",
						itemsSpacing: 2,
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
	);
}
