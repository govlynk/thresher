import React from "react";
import { Box, Alert } from "@mui/material";
import { CapabilityStatementForm } from "../components/capability/CapabilityStatementForm";
import { useGlobalStore } from "../stores/globalStore";
import { useCapabilityStatementStore } from "../stores/capabilityStatementStore";
import { usePastPerformanceStore } from "../stores/pastPerformanceStore";
import { useCertificationStore } from "../stores/certificationStore";

export default function CapabilityStatementScreen() {
	const { activeCompanyId } = useGlobalStore.getState();
	const { statement, fetchStatement, saveStatement } = useCapabilityStatementStore();
	const { performances, fetchPerformances } = usePastPerformanceStore();
	const { certifications, fetchCertifications } = useCertificationStore();

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to manage capability statement</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<CapabilityStatementForm />
		</Box>
	);
}
