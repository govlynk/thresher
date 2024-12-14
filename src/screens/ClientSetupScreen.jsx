import React from "react";
import { Box, Stepper, Step, StepLabel, Paper } from "@mui/material";
import { useSetupWorkflowStore } from "../stores/setupWorkflowStore";
import { CompanySearchStep } from "../components/clientSetup/CompanySearchStep";
import { ContactsStep } from "../components/clientSetup/ContactsStep";
import { AdminSetupStep } from "../components/clientSetup/AdminSetupStep";
import { TeamSetupScreen } from "../components/clientSetup/TeamSetupScreen";

const steps = ["Company Search", "Contacts", "Admin Setup", "Team Setup"];

export default function ClientSetupScreen() {
	const { activeStep, getCompanyData } = useSetupWorkflowStore();

	const renderStep = () => {
		switch (activeStep) {
			case 0:
				return <CompanySearchStep />;
			case 1:
				return <ContactsStep initial={getCompanyData()} />;
			case 2:
				return <AdminSetupStep />;
			case 3:
				return <TeamSetupScreen />;
			default:
				return null;
		}
	};

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
