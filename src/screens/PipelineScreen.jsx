import React from "react";
import { Box, Container, Alert, Typography } from "@mui/material";
import { KanbanBoard } from "../components/pipeline/KanbanBoard";
import { useOpportunityStore } from "../stores/opportunityStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";

export default function PipelineScreen() {
	const { savedOpportunities, loading, error, moveOpportunity } = useOpportunityStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	const handleOpportunityMove = async (opportunityId, newStatus) => {
		try {
			await moveOpportunity(opportunityId, newStatus);
		} catch (err) {
			console.error("Error moving opportunity:", err);
		}
	};

	if (!activeCompany) {
		return (
			<Container maxWidth={false}>
				<Box sx={{ p: 4 }}>
					<Alert severity='warning'>Please select a company to view pipeline</Alert>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
					Pipeline
				</Typography>
				<KanbanBoard
					opportunities={savedOpportunities}
					loading={loading}
					error={error}
					onOpportunityMove={handleOpportunityMove}
				/>
			</Box>
		</Container>
	);
}
