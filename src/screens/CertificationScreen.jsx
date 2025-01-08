import React from "react";
import { Container, Box, Typography, Alert } from "@mui/material";
import { CertificationForm } from "../components/marketPositioning/CertificationForm";
import { useGlobalStore } from "../stores/globalStore";

export default function CertificationScreen() {
	const { activeCompanyId } = useGlobalStore();

	if (!activeCompanyId) {
		return (
			<Container>
				<Box sx={{ p: 3 }}>
					<Alert severity='warning'>Please select a company to manage certifications</Alert>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 2, width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					Certifications
				</Typography>
				<CertificationForm />
			</Box>
		</Container>
	);
}
