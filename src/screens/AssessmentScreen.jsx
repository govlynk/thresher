import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { AssessmentForm } from "../components/Assessment/AssessmentForm";

function AssessmentScreen() {
	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<AssessmentForm />
			</Box>
		</Container>
	);
}

export default AssessmentScreen;
