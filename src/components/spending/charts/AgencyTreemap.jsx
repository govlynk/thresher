import { ResponsiveTreeMap } from "@nivo/treemap";
import { Box, Typography, useTheme } from "@mui/material";
import { formatBillions } from "../../../utils/formatters";

export function AgencyTreemap({ data = [] }) {
	const theme = useTheme();

	const customTheme = {
		labels: {
			text: {
				fontSize: 14,
				fill: theme.palette.text.primary,
			},
		},
		tooltip: {
			container: {
				background: theme.palette.background.paper,
				color: theme.palette.text.primary,
				fontSize: "14px",
				borderRadius: "4px",
				boxShadow: theme.shadows[3],
				padding: "8px 12px",
			},
		},
	};

	return (
		<Box sx={{ height: "600px" }}>
			<ResponsiveTreeMap
				data={data}
				identity='name'
				valueFormat={(value) => formatBillions(value)}
				margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
				labelSkipSize={12}
				label={(d) => `${d.name}\n${d.formattedValue}`}
				sortBy={(a, b) => b.data.sortIndex - a.data.sortIndex}
				labelTextColor={{
					from: "color",
					modifiers: [["darker", 2]],
				}}
				parentLabelPosition='top'
				parentLabelTextColor={{
					from: "color",
					modifiers: [["darker", 0.2]],
				}}
				borderColor={{
					from: "color",
					modifiers: [["darker", 0.2]],
				}}
				colors={{ scheme: "paired" }}
				theme={customTheme}
				tooltip={({ node }) => (
					<Box>
						<strong>{node.data.name}</strong>
						<br />
						Amount: {formatBillions(node.value)}
					</Box>
				)}
				animate={true}
				motionConfig='gentle'
				enableParentLabel={true}
			/>
		</Box>
	);
}
