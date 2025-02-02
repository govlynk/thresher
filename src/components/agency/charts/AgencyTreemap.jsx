import { useMemo } from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { Box, Typography, useTheme, CircularProgress, Alert } from "@mui/material";
import { formatBillions } from "../../../utils/formatters";

export function AgencyTreemap({ data }) {
	const theme = useTheme();
	console.log("AgencyTreemap data:", data);

	const transformedData = useMemo(() => {
		if (!data?.obligations_by_category) return null;

		// Transform data into hierarchical structure
		return {
			name: "Agency Spending",
			children: data.obligations_by_category
				.filter((cat) => cat.aggregated_amount > 0)
				.map((category) => ({
					name: category.category,
					value: category.aggregated_amount,
					color: `hsl(${Math.random() * 360}, 70%, 50%)`,
				})),
		};
	}, [data]);

	if (!transformedData) {
		return <Alert severity='info'>No spending data available</Alert>;
	}

	return (
		<Box sx={{ height: 400, width: "100%" }}>
			<Typography variant='h6' gutterBottom>
				Agency Spending Distribution
			</Typography>
			<Box sx={{ height: "calc(100% - 32px)" }}>
				<ResponsiveTreeMap
					data={transformedData}
					identity='name'
					value='value'
					valueFormat={formatBillions}
					margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
					labelSkipSize={12}
					labelTextColor={{
						from: "color",
						modifiers: [["darker", 3]],
					}}
					parentLabelPosition='left'
					parentLabelTextColor={{
						from: "color",
						modifiers: [["darker", 1.2]],
					}}
					borderColor={{
						from: "color",
						modifiers: [["darker", 0.2]],
					}}
					colors={{ scheme: "category10" }}
					theme={{
						fontSize: 11,
						tooltip: {
							container: {
								background: theme.palette.background.paper,
								color: theme.palette.text.primary,
								fontSize: "12px",
								borderRadius: "4px",
								boxShadow: theme.shadows[3],
								padding: "8px 12px",
							},
						},
					}}
					tooltip={({ node }) => (
						<Box>
							<strong>{node.data.name}</strong>
							<div>Amount: {formatBillions(node.value)}</div>
						</Box>
					)}
				/>
			</Box>
		</Box>
	);
}
