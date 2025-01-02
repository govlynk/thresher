import React, { useEffect, useState, useCallback } from "react";
import { Box, Container } from "@mui/material";
import { AboutSection } from "../marketPositioning/sections/AboutSection";
import { ReviewSection } from "../marketPositioning/sections/ReviewSection";
import { FormController } from "../common/form/FormController";
import { CompanyInfoStep } from "./steps/CompanyInfoStep";
import { ReviewStep } from "./steps/ReviewStep";
import { useAssessmentStore } from "../../stores/assessmentStore";
import { strategicPositioningStore } from "../../stores/strategicPositioningStore";
import { useGlobalStore } from "../../stores/globalStore";
import { questionInfo } from "./questionInfo";
import { useFormAutosave } from "../common/form/useFormAutosave";

const INITIAL_FORM_STATE = {
	aboutUs: "",
	mission: "",
	vision: "",
	competitiveAdvantage: "",
	keyCapabilities: [],
};

const steps = [
	{
		id: "companyInfo",
		label: "Company Information",
		component: CompanyInfoStep,
		validate: (data) => {
			const errors = {};
			if (!data.companyName?.trim()) errors.companyName = "Company name is required";
			if (!data.dunsNumber?.trim()) errors.dunsNumber = "DUNS number is required";
			if (!data.description?.trim()) errors.description = "Description is required";
			return Object.keys(errors).length ? errors : null;
		},
	},
	{
		id: "capabilities",
		label: "Core Capabilities",
		component: CapabilitiesStep,
		validate: (data) => {
			const errors = {};
			if (!data.capabilities?.length) {
				errors.capabilities = "At least one capability is required";
			}
			return Object.keys(errors).length ? errors : null;
		},
	},
	{
		id: "certifications",
		label: "Certifications",
		component: CertificationsStep,
		validate: (data) => {
			const errors = {};
			if (data.certifications?.some((cert) => !cert.name || !cert.issuer)) {
				errors.certifications = "All certifications must have a name and issuer";
			}
			return Object.keys(errors).length ? errors : null;
		},
	},
	{
		id: "review",
		label: "Review",
		component: ReviewStep,
	},
];

export function AssessmentForm() {
	const { setAnswer, saveProgress, answers, loading, error } = useAssessmentStore();

	// Enable autosave
	useFormAutosave({
		formData: answers,
		onSave: saveProgress,
	});

	const handleSubmit = async (formData) => {
		await setAnswer(formData);
	};

	return (
		<Container maxWidth='md'>
			<Box sx={{ py: 4 }}>
				<FormController
					steps={steps}
					initialData={answers}
					onSubmit={handleSubmit}
					onSave={saveProgress}
					loading={loading}
					error={error}
					questionInfo={questionInfo}
				/>
			</Box>
		</Container>
	);
}
