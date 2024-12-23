import React from "react";
import { Box, Container, Typography, Alert, CircularProgress } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useCapabilityStatementStore } from "../stores/capabilityStatementStore";
import CapabilityStatementForm from "../components/capability1/CapabilityStatementForm";

function CapabilityStatementScreen() {
	const { activeCompanyId } = useGlobalStore.getState();
	const { loading, error } = useCapabilityStatementStore();

	if (!activeCompanyId) {
		return (
			<Container maxWidth={false}>
				<Box sx={{ p: 4 }}>
					<Alert severity='warning'>Please select a company to manage capability statement</Alert>
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
					Capability Statement
				</Typography>
				{error && (
					<Alert severity='error' sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				<CapabilityStatementForm />
			</Box>
		</Container>
	);
}

export default CapabilityStatementScreen;
