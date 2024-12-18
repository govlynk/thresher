import React from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function AgencySpendingChart({ data }) {
	if (!data?.results?.length) {
		return (
			<Typography color='text.secondary' align='center'>
				No agency spending data available
			</Typography>
		);
	}

	const chartData = data.results.map((item) => ({
		name: item.agency_name || item.name,
		value: item.amount,
	}));

	return (
		<Box sx={{ width: "100%", height: 400 }}>
			<ResponsiveContainer>
				<PieChart>
					<Pie
						data={chartData}
						cx='50%'
						cy='50%'
						labelLine={false}
						outerRadius={150}
						fill='#8884d8'
						dataKey='value'
						label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
					>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<Tooltip
						formatter={(value) =>
							new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(value)
						}
					/>
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</Box>
	);
}
