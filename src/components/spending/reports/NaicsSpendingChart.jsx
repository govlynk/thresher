import React from "react";
import { Box, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function NaicsSpendingChart({ data }) {
	if (!data?.results?.length) {
		return (
			<Typography color='text.secondary' align='center'>
				No NAICS spending data available
			</Typography>
		);
	}

	const chartData = data.results.map((item) => ({
		naics: `${item.naics_code || item.code} - ${item.naics_description || item.name}`,
		amount: item.amount || 0,
	}));

	return (
		<Box sx={{ width: "100%", height: 400 }}>
			<ResponsiveContainer>
				<BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='naics' angle={-45} textAnchor='end' interval={0} height={100} />
					<YAxis
						tickFormatter={(value) =>
							new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
								notation: "compact",
								maximumFractionDigits: 1,
							}).format(value)
						}
					/>
					<Tooltip
						formatter={(value) =>
							new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "USD",
							}).format(value)
						}
					/>
					<Bar dataKey='amount' fill='#8884d8' />
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
}
