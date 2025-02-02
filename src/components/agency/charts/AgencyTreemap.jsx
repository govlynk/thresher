import { ResponsiveTreeMap } from "@nivo/treemap";
import { Box, Typography, useTheme } from "@mui/material";
import { useCallback } from "react";
import { formatBillions } from "../../../utils/formatters";
import { useNavigate } from "react-router-dom";

export function AgencyTreemap({ data = [] }) {
	const theme = useTheme();
	const navigate = useNavigate();

	const handleNodeClick = useCallback(
		(node) => {
			console.log("Node clicked:", node);
			if (node.data?.id !== "others") {
				// Navigate to agency analysis with the toptier code
				navigate("/agency-analysis", {
					state: {
						toptier_code: node.data?.code,
						agency_name: node.data?.name,
					},
				});
			}
		},
		[navigate]
	);

	const getNodeColor = (node) => {
		// Special color for "All Others"
		if (node.data.name === "All Others") {
			return theme.palette.mode === "dark" ? "#666666" : "#E0E0E0";
		}

		// Color scale for agencies
		const colors = [
			"#FFB74D", // Orange
			"#4DB6AC", // Teal
			"#4FC3F7", // Light Blue
			"#7986CB", // Indigo
			"#9575CD", // Deep Purple
			"#4DD0E1", // Cyan
			"#81C784", // Light Green
			"#DCE775", // Lime
			"#FFD54F", // Amber
			"#FF8A65", // Deep Orange
		];

		const index = node.data.index || 0;
		return colors[index % colors.length];
	};

	if (!data) return null;

	return (
		<Box sx={{ height: "100%", width: "100%" }}>
			<ResponsiveTreeMap
				tile='binary'
				data={data}
				identity='name'
				value='value'
				valueFormat={formatBillions}
				leavesOnly={true}
				innerPadding={3}
				outerPadding={3}
				margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
				labelSkipSize={32}
				label={(node) => `${node.data.name}\n${(node.data.percentage || 0).toFixed(1)}%`}
				sortBy={(a, b) => b.data.sortIndex - a.data.sortIndex}
				labelTextColor={{
					from: "color",
					modifiers: [["darker", theme.palette.mode === "dark" ? 4 : 2]],
				}}
				parentLabelPosition='top'
				parentLabelTextColor={{
					from: "color",
					modifiers: [["darker", theme.palette.mode === "dark" ? 3 : 1.5]],
				}}
				borderColor={{
					from: "color",
					modifiers: [["darker", 0.2]],
				}}
				colors={getNodeColor}
				animate={true}
				motionConfig='gentle'
				onClick={(node) => handleNodeClick(node)}
				isInteractive={true}
				theme={{
					fontSize: 12,
					labels: {
						text: {
							fontSize: 11,
							fontWeight: 500,
						},
					},
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
						<Box sx={{ fontWeight: 600, mb: 1 }}>{node.data.name}</Box>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
							<Box>Amount: {node.data.formattedValue}</Box>
							<Box>Percentage: {(node.data.percentage || 0).toFixed(1)}%</Box>
							{node.data.code && node.data.code !== "others" && (
								<Box sx={{ color: "text.secondary", fontSize: "0.8em", mt: 0.5 }}>Click to view details</Box>
							)}
						</Box>
					</Box>
				)}
			/>
		</Box>
	);
}
