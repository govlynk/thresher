import React from "react";
import { Box, Typography, Alert, CircularProgress, Grid, Paper } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useSpendingReportsQuery } from "../utils/useSpendingReportsQuery";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveChoropleth } from "@nivo/geo";
import { features } from "../utils/spending/usStatesGeo";
import { formatToBillions } from "../utils/formatters";
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Pie chart theme
const pieTheme = {
	fontSize: 12,
	tooltip: {
		container: {
			background: "#333",
			color: "#fff",
			fontSize: "12px",
			borderRadius: "4px",
			padding: "8px 12px",
		},
	},
};

// Bar chart theme
const barTheme = {
	...pieTheme,
	axis: {
		ticks: {
			text: {
				fontSize: 10,
			},
		},
		legend: {
			text: {
				fontSize: 12,
			},
		},
	},
};

export default function SpendingAnalysisScreen() {
	const { activeCompanyData } = useGlobalStore();
	const { data, isLoading, error } = useSpendingReportsQuery(activeCompanyData);

	if (!activeCompanyData) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view spending analysis.</Alert>
			</Box>
		);
	}

	if (!activeCompanyData.naicsCode?.length) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='info'>
					No NAICS codes found for this company. NAICS codes are required for spending analysis.
				</Alert>
			</Box>
		);
	}

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='error'>{error?.message || "Failed to fetch spending data"}</Alert>
			</Box>
		);
	}

	// Process agency spending data for pie chart
	const agencyData =
		data?.agencySpending?.results?.map((agency) => ({
			id: agency.name,
			label: agency.name,
			value: formatToBillions(agency.amount),
		})) || [];

	// Process NAICS spending data for bar chart
	const naicsData =
		data?.naicsSpending?.results?.map((item) => ({
			naics: item.code,
			amount: formatToBillions(item.amount),
			description: item.name,
		})) || [];

	// Process spending timeline data for line chart
	const timelineData = [
		{
			id: "spending",
			data:
				data?.spendingData?.results?.map((item) => ({
					x: new Date(item.action_date).toLocaleDateString(),
					y: item.total_obligation,
				})) || [],
		},
	];

	// Process geographic data for choropleth
	const geoData =
		data?.geographicSpending?.results?.map((state) => ({
			id: state.shape_code,
			value: formatToBillions(state.amount),
		})) || [];

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Federal Spending Analysis
			</Typography>

			<Grid container spacing={3}>
				{/* Agency Spending Distribution */}
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: 400 }}>
						<Typography variant='h6' gutterBottom>
							Agency Spending Distribution
						</Typography>
						<Box sx={{ height: 350 }}>
							<ResponsivePie
								data={agencyData}
								margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
								innerRadius={0.5}
								padAngle={0.7}
								cornerRadius={3}
								activeOuterRadiusOffset={8}
								theme={pieTheme}
								arcLinkLabelsSkipAngle={10}
								arcLinkLabelsTextColor='#333333'
								arcLabelsSkipAngle={10}
								legends={[
									{
										anchor: "bottom",
										direction: "row",
										translateY: 56,
										itemWidth: 100,
										itemHeight: 18,
										symbolSize: 18,
										symbolShape: "circle",
									},
								]}
							/>
						</Box>
					</Paper>
				</Grid>

				{/* NAICS Spending */}
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, height: 400 }}>
						<Typography variant='h6' gutterBottom>
							Spending by NAICS Code
						</Typography>
						<Box sx={{ height: 350 }}>
							<ResponsiveBar
								data={naicsData}
								keys={["amount"]}
								indexBy='naics'
								margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
								padding={0.3}
								theme={barTheme}
								axisBottom={{
									tickSize: 5,
									tickPadding: 5,
									tickRotation: -45,
								}}
								tooltip={({ value, indexValue }) => (
									<div style={{ padding: "12px", background: "#333", color: "#fff" }}>
										<strong>{indexValue}</strong>
										<br />${value.toLocaleString()}
									</div>
								)}
							/>
						</Box>
					</Paper>
				</Grid>

				{/* Spending Timeline */}
				<Grid item xs={12}>
					<Paper sx={{ p: 3, height: 400 }}>
						<Typography variant='h6' gutterBottom>
							Spending Timeline
						</Typography>
						<Box sx={{ height: 350 }}>
							<ResponsiveLine
								data={timelineData}
								margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
								xScale={{ type: "point" }}
								yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
								axisTop={null}
								axisRight={null}
								theme={barTheme}
								pointSize={10}
								pointColor={{ theme: "background" }}
								pointBorderWidth={2}
								pointBorderColor={{ from: "serieColor" }}
								enableSlices='x'
								useMesh={true}
							/>
						</Box>
					</Paper>
				</Grid>

				{/* Geographic Distribution */}
				<Grid item xs={12}>
					<Paper sx={{ p: 3, height: 500 }}>
						<Typography variant='h6' gutterBottom>
							Geographic Distribution
						</Typography>
						<Box sx={{ height: 450 }}>
							<ResponsiveChoropleth
								data={geoData}
								features={features}
								margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
								colors='blues'
								domain={[0, Math.max(...geoData.map((d) => d.value))]}
								projectionScale={1000}
								projectionTranslation={[0.5, 0.5]}
								projectionRotation={[0, 0, 0]}
								borderWidth={0.5}
								borderColor='#152538'
								theme={pieTheme}
								legends={[
									{
										anchor: "bottom-left",
										direction: "column",
										justify: true,
										translateX: 20,
										translateY: -20,
										itemsSpacing: 0,
										itemWidth: 94,
										itemHeight: 18,
										itemDirection: "left-to-right",
										itemTextColor: "#444444",
										itemOpacity: 0.85,
										symbolSize: 18,
									},
								]}
							/>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
