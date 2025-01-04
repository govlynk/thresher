import React from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { Box, useTheme } from "@mui/material";

export function MaturityRadarChart({ data = [], keys = ["current", "target"] }) {
	const theme = useTheme();

	// Ensure data is an array and has the correct structure
	const validData = Array.isArray(data) ? data : [];

	const chartTheme = {
		textColor: "green",
		tooltip: {
			container: {
				background: theme.palette.background.paper,
				color: theme.palette.primary.main,
			},
		},
		dots: {
			text: {
				fill: theme.palette.primary.main,
			},
		},
		axis: {
			ticks: {
				text: {
					fontSize: 12,
					fill: theme.palette.primary.main,
					outlineWidth: 0,
					outlineColor: "transparent",
				},
			},
		},

		annotations: {
			text: {
				fontSize: 20,
				fill: "#333333",
				outlineWidth: 2,
				outlineColor: "#ffffff",
				outlineOpacity: 1,
			},
		},
	};

	// If no data, show empty state
	if (validData.length === 0) {
		return (
			<Box
				sx={{
					height: 500,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "text.secondary",
				}}
			>
				No data available
			</Box>
		);
	}

	return (
		<Box sx={{ height: 400 }}>
			<ResponsiveRadar
				data={validData}
				keys={keys}
				indexBy='dimension'
				maxValue={5}
				margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
				curve='linearClosed'
				borderWidth={2}
				borderColor={{ from: "color" }}
				gridLevels={5}
				gridShape='linear'
				gridLabelOffset={36}
				enableDots={true}
				dotSize={8}
				dotColor={{ theme: "background" }}
				dotBorderWidth={2}
				dotBorderColor={{ from: "color" }}
				enableDotLabel={true}
				dotLabel='value'
				dotLabelYOffset={-12}
				// colors={[theme.palette.primary.main, theme.palette.secondary.main, theme.palette.info.main]}
				colors={[theme.palette.chart.colorPrimary, theme.palette.chart.colorSecondary]}
				fillOpacity={0.75}
				blendMode='multiply'
				animate={true}
				motionConfig='gentle'
				theme={chartTheme}
				legends={[
					{
						anchor: "top-left",
						direction: "column",
						translateX: -50,
						translateY: -40,
						itemWidth: 80,
						itemHeight: 20,
						itemTextColor: theme.palette.primary.main,
						symbolSize: 12,
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
	);
}
