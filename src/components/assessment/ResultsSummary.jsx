import { Paper, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { useAssessmentStore } from "../../stores/assessmentStore";

export function ResultsSummary() {
	const { answers } = useAssessmentStore();

	const getRecommendations = (answers) => {
		const recommendations = [];

		if (answers.registration === "No" || answers.registration === "In Progress") {
			recommendations.push("Complete your SAM.gov registration as this is required for federal contracting");
		}

		if (answers.naicsCodes === "No" || answers.naicsCodes === "Need Help") {
			recommendations.push("Research and identify appropriate NAICS codes that match your capabilities");
		}

		if (answers.businessType === "No" || answers.businessType === "Need Help") {
			recommendations.push("Determine your business size and eligibility for socioeconomic programs");
		}

		if (answers.capabilities === "No" || answers.capabilities === "In Development") {
			recommendations.push("Develop a clear capabilities statement highlighting your core competencies");
		}

		return recommendations;
	};

	const recommendations = getRecommendations(answers);

	return (
		<Paper sx={{ p: 3, mt: 4 }}>
			<Typography variant='h5' gutterBottom>
				Assessment Results
			</Typography>

			<Typography variant='body1' sx={{ mb: 3 }}>
				Based on your responses, here are our recommendations:
			</Typography>

			<List>
				{recommendations.map((rec, index) => (
					<ListItem key={index}>
						<ListItemText primary={rec} />
					</ListItem>
				))}
			</List>

			<Button variant='contained' color='primary' sx={{ mt: 3 }} onClick={() => window.print()}>
				Print Results
			</Button>
		</Paper>
	);
}
