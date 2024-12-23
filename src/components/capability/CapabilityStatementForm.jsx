import React from "react";
import { Box, Container } from "@mui/material";
import { FormController } from "../common/form/FormController";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { CoreCapabilitiesStep } from "./steps/CoreCapabilitiesStep";
import { PastPerformanceStep } from "./steps/PastPerformanceStep";
import { CertificationsStep } from "./steps/CertificationsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { useCapabilityStatementStore } from "../../stores/capabilityStatementStore";
import { questionInfo } from "./questionInfo";
import { useFormAutosave } from "../common/form/useFormAutosave";

const steps = [
	{
		id: "basicInfo",
		label: "Basic Information",
		component: BasicInfoStep,
		validate: (data) => {
			const errors = {};
			console.log("rtf text", data);

			if (!data.aboutUs?.trim()) errors.aboutUs = "About Us is required";
			if (!data.mission?.trim()) errors.mission = "Mission is required";
			if (!data.vision?.trim()) errors.vision = "Vision is required";
			return Object.keys(errors).length ? errors : null;
		},
	},
	{
		id: "coreCapabilities",
		label: "Core Capabilities",
		component: CoreCapabilitiesStep,
		validate: (data) => {
			const errors = {};
			if (!data.keyCapabilities?.length) {
				errors.keyCapabilities = "At least one capability is required";
			}
			return Object.keys(errors).length ? errors : null;
		},
	},
	{
		id: "pastPerformance",
		label: "Past Performance",
		component: PastPerformanceStep,
		validate: (data) => {
			const errors = {};
			if (!data.pastPerformances?.length) {
				errors.pastPerformances = "At least one past performance is required";
			}
			return Object.keys(errors).length ? errors : null;
		},
	},
	{
		id: "certifications",
		label: "Certifications",
		component: CertificationsStep,
	},
	{
		id: "review",
		label: "Review",
		component: ReviewStep,
	},
];

export default function CapabilityStatementForm() {
	const { formData, setFormData, submitForm, setAnswer, loading, error } = useCapabilityStatementStore();

	useFormAutosave({
		formData,
		onSave: setFormData,
	});

	const handleSubmit = async (data) => {
		await submitForm(data);
	};

	return (
		<Container maxWidth='lg'>
			<Box sx={{ py: 4 }}>
				<FormController
					steps={steps}
					initialData={formData}
					onSubmit={handleSubmit}
					onSave={setFormData}
					loading={loading}
					error={error}
					questionInfo={questionInfo}
				/>
			</Box>
		</Container>
	);
}
