import { ResponsiveTreeMap } from "@nivo/treemap";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { formatBillions } from "../../../utils/formatters";

export function AgencyTreemap({ data = [] }) {
	const theme = useTheme();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	const chartData = useMemo(
		() =>
			data?.results?.map((agency) => ({
				id: agency.name,
				label: agency.name,
				value: agency.amount,
			})) || [],
		[data]
	);

	useEffect(() => {
		const loadData = async () => {
			try {
				const spendingData = await fetchAgencySpending(2025);
				const formattedData = {
					name: "Agency Spending",
					children: spendingData.results.map((agency) => ({
						name: agency.agency_name,
						value: agency.obligated_amount,
						color: getAgencyColor(agency.agency_name),
					})),
				};
				setData(formattedData);
			} catch (error) {
				console.error("Error loading data:", error);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	const getAgencyColor = (agencyName) => {
		const colorMap = {
			Army: "#4B5320",
			"Air Force": "#808080",
			Navy: "#000080",
			SOCOM: "#DAA520",
			DOS: "#8B4513",
		};
		return colorMap[agencyName] || "#666666";
	};

	if (loading) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<Box sx={{ height: "600px" }}>
			<ResponsiveTreeMap
				data={data}
				identity='name'
				value='value'
				valueFormat='>-$.2f'
				margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
				labelSkipSize={12}
				label={(d) => `${d.name}\n${d.formattedValue}`}
				colors={(node) => node.data.color}
				borderColor={{ theme: "background" }}
				animate={true}
				motionConfig='gentle'
			/>
		</Box>
	);
}
