import React from "react";
import { Container, Box } from "@mui/material";
import SwotAnalysis from "../components/marketPositioning/SwotAnalysis";
import { useGlobalStore } from "../stores/globalStore";

export default function SwotScreen() {
	const activeCompanyId = useGlobalStore((state) => state.activeCompanyId);
	const loading = useGlobalStore((state) => state.loading);

	if (!activeCompanyId) {
		return (
			<Container>
				<Box sx={{ p: 3 }}>
					<Alert severity='warning'>Please select a company to manage strategic positioing statement</Alert>
				</Box>
			</Container>
		);
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					SWOT Analysis
				</Typography>
				<SwotAnalysis />
			</Box>
		</Container>
	);
}
