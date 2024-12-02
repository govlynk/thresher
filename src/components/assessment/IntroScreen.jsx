import { Box, Button, Paper, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";

export function IntroScreen({ onStart }) {
	return (
		<Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
			<Typography variant='h4' gutterBottom>
				Welcome to the Government Contracting Readiness Assessment
			</Typography>

			<Typography variant='body1' paragraph>
				Being prepared for government contracting is crucial for success in the federal marketplace. This assessment
				will help evaluate your readiness and identify areas for improvement.
			</Typography>

			<Typography variant='h6' gutterBottom sx={{ mt: 4 }}>
				What to Expect:
			</Typography>

			<Box component='ul' sx={{ mb: 4 }}>
				<Typography component='li'>• A series of questions about your business and capabilities</Typography>
				<Typography component='li'>• Detailed explanations and resources for each topic</Typography>
				<Typography component='li'>• A personalized readiness report with recommendations</Typography>
				<Typography component='li'>• Links to helpful resources and next steps</Typography>
			</Box>

			<Typography variant='body1' paragraph>
				For each question, you'll have access to additional information and guidance through the sidebar. Take your
				time to review these resources as they will help you make informed decisions about your contracting journey.
			</Typography>

			<Button variant='contained' size='large' endIcon={<ArrowRight />} onClick={onStart} sx={{ mt: 4 }}>
				Begin Assessment
			</Button>
		</Paper>
	);
}
