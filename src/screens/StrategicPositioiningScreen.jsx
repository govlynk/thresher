import React, { Suspense } from "react";
import { Container, Box, Typography, Alert, CircularProgress } from "@mui/material";
import StrategicPositioningForm from "../components/marketPositioning/StrategicPositioningForm - copy";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { useGlobalStore } from "../stores/globalStore";

export function StrategicPositioiningScreen() {
	const { activeCompanyId, loading } = useGlobalStore();

	if (!activeCompanyId) {
		console.error("No active company selected", activeCompanyId);
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

				<ErrorBoundary>
					<Suspense fallback={<CircularProgress />}>
						<StrategicPositioningForm />
					</Suspense>
				</ErrorBoundary>
			</Box>
		</Container>
	);
}

export default StrategicPositioiningScreen;
