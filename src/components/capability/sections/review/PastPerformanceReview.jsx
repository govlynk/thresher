import React from "react";
import { Box, Typography, Chip, Divider } from "@mui/material";
import { SectionTitle } from "./SectionTitle";
import { formatCurrency, formatDate } from "../../../../utils/formatters";

// Component for displaying performance details
const PerformanceDetails = ({ label, value }) => (
	<Typography variant='body2'>
		<strong>{label}:</strong> {value}
	</Typography>
);

// Component for a single performance entry
const PerformanceEntry = ({ performance, isLast }) => (
	<Box sx={{ mb: 2 }}>
		<Typography variant='subtitle1' sx={{ fontWeight: "bold" }}>
			{performance.projectName}
		</Typography>
		<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 1 }}>
			<PerformanceDetails label='Client' value={performance.client} />
			{performance.contractValue && (
				<PerformanceDetails label='Value' value={formatCurrency(performance.contractValue)} />
			)}
			<PerformanceDetails
				label='Period'
				value={`${formatDate(performance.startDate)} - ${formatDate(performance.endDate)}`}
			/>
		</Box>
		<Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
			{performance.description}
		</Typography>
		{!isLast && <Divider sx={{ my: 2 }} />}
	</Box>
);

export function PastPerformanceReview({ performances = [] }) {
	console.log(performances);
	return (
		<>
			<SectionTitle>Past Performance</SectionTitle>
			{performances.length > 0 ? (
				performances.map((performance, index) => (
					<PerformanceEntry
						key={performance.id || index}
						performance={performance}
						isLast={index === performances.length - 1}
					/>
				))
			) : (
				<Typography color='text.secondary'>No past performance entries added</Typography>
			)}
		</>
	);
}
