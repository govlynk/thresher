import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { MaturityAssessmentContainer } from "../components/maturity/MaturityAssessmentContainer";

function MaturityAssessmentScreen() {
	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 2, width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					Government Contracting Maturity Assessment
				</Typography>
				<MaturityAssessmentContainer />
			</Box>
		</Container>
	);
}

// Make sure to use a default export
export default MaturityAssessmentScreen;
