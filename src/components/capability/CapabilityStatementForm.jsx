import React, { useEffect, useCallback } from "react";
import { Box, Stepper, Step, StepLabel, Paper, Alert } from "@mui/material";
import { useCapabilityStatementStore } from "../../stores/capabilityStatementStore";
import { useGlobalStore } from "../../stores/globalStore";
import BasicInfoStep from "./steps/BasicInfoStep";
import PastPerformanceStep from "./steps/PastPerformanceStep";
import CertificationsStep from "./steps/CertificationsStep";
import ReviewStep from "./steps/ReviewStep";

const steps = ["Basic Information", "Past Performance", "Certifications", "Review"];

export default function CapabilityStatementForm() {
	const { activeStep, initializeForm, initialized } = useCapabilityStatementStore();
	const { activeCompanyId } = useGlobalStore.getState();

	const initForm = useCallback(async () => {
		if (activeCompanyId && !initialized) {
			await initializeForm(activeCompanyId);
		}
	}, [activeCompanyId, initializeForm, initialized]);

	useEffect(() => {
		initForm();
	}, [initForm]);

	const renderStep = () => {
		switch (activeStep) {
			case 0:
				return <BasicInfoStep />;
			case 1:
				return <PastPerformanceStep />;
			case 2:
				return <CertificationsStep />;
			case 3:
				return <ReviewStep />;
			default:
				return null;
		}
	};

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to create a capability statement</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Paper sx={{ p: 3, mb: 3 }}>
				<Stepper activeStep={activeStep}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</Paper>

			{renderStep()}
		</Box>
	);
}
