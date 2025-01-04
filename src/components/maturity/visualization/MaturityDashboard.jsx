import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Alert, FormControl, Select, MenuItem, Grid, Paper } from "@mui/material";
import { Plus } from "lucide-react";
import { MaturityRadarChart } from "./MaturityRadarChart";
import { SectionScoreCard } from "../sections/SectionScoreCard";
import { useMaturityStore } from "../../../stores/maturityStore";

export function MaturityDashboard({ onNewAssessment }) {
	const { assessment, assessments, selectAssessment, processedData } = useMaturityStore();
	const [selectedId, setSelectedId] = useState(assessment?.id);

	useEffect(() => {
		if (assessment?.id && assessment.id !== selectedId) {
			setSelectedId(assessment.id);
		}
	}, [assessment?.id]);

	const handleAssessmentChange = (event) => {
		const newId = event.target.value;
		setSelectedId(newId);
		selectAssessment(newId);
	};

	if (!assessment) {
		return <Alert severity='info'>No assessment data available</Alert>;
	}
	console.log(assessment);
	return (
		<Box>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
				<Typography variant='h5'>{assessment.title || "Maturity Assessment Dashboard"}</Typography>
				<Button variant='contained' startIcon={<Plus />} onClick={onNewAssessment}>
					New Assessment
				</Button>
			</Box>

			{assessments.length > 0 && (
				<FormControl fullWidth sx={{ mb: 4 }}>
					<Select value={selectedId || ""} onChange={handleAssessmentChange} displayEmpty>
						{assessments.map((a) => (
							<MenuItem key={a.id} value={a.id}>
								{a.title || "Maturity Assessment"} -{" "}
								{new Date(a.completedAt || a.lastModified).toLocaleDateString()}
								{a.status === "IN_PROGRESS" && " (In Progress)"}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			)}

			{processedData && (
				<>
					<Box>
						<Typography variant='h4' gutterBottom>
							Assessment Summary
						</Typography>

						<Grid container spacing={3}>
							{/* Radar Chart */}
							<Grid item xs={12} md={6}>
								<Paper sx={{ p: 3, height: "100%" }}>
									<Typography variant='h6' gutterBottom>
										Maturity Overview
									</Typography>
									<Box sx={{ height: 400 }}>
										<MaturityRadarChart data={processedData.radarChartData} />
									</Box>
								</Paper>
							</Grid>

							{/* Overall Score */}
							<Grid item xs={12} md={6}>
								<Paper sx={{ p: 3, height: "100%" }}>
									<Typography variant='h6' gutterBottom>
										Overall Maturity Score
									</Typography>
									<Typography variant='h2' align='center' color='primary'>
										{processedData.overallScore.toFixed(1)}
									</Typography>
									<Typography variant='subtitle1' align='center' color='text.secondary'>
										out of 5.0
									</Typography>
								</Paper>
							</Grid>

							{/* Section Scores */}
							{processedData.sections.map((section) => (
								<Grid item xs={12} md={6} key={section.id}>
									<SectionScoreCard section={section} />
								</Grid>
							))}
						</Grid>
					</Box>
				</>
			)}
		</Box>
	);
}
