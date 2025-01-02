import React from "react";
import { Box, Stepper, Step, StepLabel, StepConnector, styled } from "@mui/material";
import { Check } from "lucide-react";

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
	"& .MuiStepConnector-line": {
		borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[300],
	},
}));

const CustomStepIcon = styled("div")(({ theme, completed, active }) => ({
	width: 32,
	height: 32,
	borderRadius: "50%",
	border: `2px solid ${
		completed ? theme.palette.success.main : active ? theme.palette.primary.main : theme.palette.grey[300]
	}`,
	backgroundColor: completed || active ? "transparent" : "transparent",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "all 0.3s ease",
	color: completed ? theme.palette.success.main : active ? theme.palette.primary.main : theme.palette.text.disabled,
}));

export function StepperProgress({ steps, activeStep, onStepClick }) {
	return (
		<Box sx={{ width: "100%", mb: 4 }}>
			<Stepper activeStep={activeStep} alternativeLabel connector={<CustomStepConnector />}>
				{steps.map((step, index) => (
					<Step
						key={step.id}
						completed={index < activeStep}
						onClick={() => onStepClick(index)}
						sx={{ cursor: "pointer" }}
					>
						<StepLabel
							StepIconComponent={(props) => (
								<CustomStepIcon completed={props.completed} active={props.active}>
									{props.completed ? <Check size={16} /> : index + 1}
								</CustomStepIcon>
							)}
						>
							{step.label}
						</StepLabel>
					</Step>
				))}
			</Stepper>
		</Box>
	);
}
