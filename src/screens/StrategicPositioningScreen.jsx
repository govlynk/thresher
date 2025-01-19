import React from "react";
import { Container, Box, Typography, Alert, CircularProgress } from "@mui/material";
import StrategicPositioningForm from "../components/marketPositioning/StrategicPositioningForm";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { useGlobalStore } from "../stores/globalStore";

export function StrategicPositioiningScreen() {
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
			<Box sx={{ p: 2, width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					Strategic Positioning
				</Typography>

				<StrategicPositioningForm />
			</Box>
		</Container>
	);
}

export default StrategicPositioiningScreen;
