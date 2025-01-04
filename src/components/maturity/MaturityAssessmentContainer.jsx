import React, { useEffect } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import { useMaturityStore } from "../../stores/maturityStore";
import { useGlobalStore } from "../../stores/globalStore";
import { MaturityDashboard } from "./visualization/MaturityDashboard";
import { MaturityAssessmentForm } from "./MaturityAssessmentForm";

export function MaturityAssessmentContainer() {
	const { activeCompanyId } = useGlobalStore();
	const { assessment, assessments, fetchAssessment, loading, error } = useMaturityStore();
	const [showNewForm, setShowNewForm] = React.useState(false);

	useEffect(() => {
		if (activeCompanyId) {
			fetchAssessment(activeCompanyId);
		}
	}, [activeCompanyId, fetchAssessment]);

	if (!activeCompanyId) {
		return <Alert severity='warning'>Please select a company to view maturity assessment</Alert>;
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Alert severity='error'>{error}</Alert>;
	}

	return showNewForm || !assessments.length ? (
		<MaturityAssessmentForm onComplete={() => setShowNewForm(false)} />
	) : (
		<MaturityDashboard onNewAssessment={() => setShowNewForm(true)} />
	);
}
