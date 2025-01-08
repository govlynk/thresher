import React, { Suspense } from "react";
import { Container, Box, Typography, Alert, CircularProgress } from "@mui/material";
import { PastPerformanceForm } from "../components/marketPositioning/PastPerformanceForm";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import { useGlobalStore } from "../stores/globalStore";

export function PastPerformanceScreen() {
	const { activeCompanyId, loading } = useGlobalStore();

	if (!activeCompanyId) {
		console.error("No active company selected", activeCompanyId);
		return (
			<Container>
				<Box sx={{ p: 3 }}>
					<Alert severity='warning'>Please select a company to manage past performance</Alert>
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
				<ErrorBoundary>
					<Suspense fallback={<CircularProgress />}>
						<PastPerformanceForm />
					</Suspense>
				</ErrorBoundary>
			</Box>
		</Container>
	);
}

export default PastPerformanceScreen;
