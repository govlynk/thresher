import React, { useEffect, useState, useCallback } from "react";
import { useCapabilityStatementStore } from "../../stores/capabilityStatementStore";
import { useGlobalStore } from "../../stores/globalStore";
import {
	Box,
	Button,
	Card,
	CardContent,
	LinearProgress,
	Stepper,
	Step,
	StepLabel,
	Typography,
	Alert,
} from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AboutSection } from "./sections/AboutSection";
import { MissionVisionSection } from "./sections/MissionVisionSection";
import { CompetitiveSection } from "./sections/CompetitiveSection";
import { CapabilitiesSection } from "./sections/CapabilitiesSection";
import { ReviewSection } from "./sections/ReviewSection";

const steps = ["About Us", "Mission & Vision", "Competitive Advantage", "Key Capabilities", "Review"];

const INITIAL_FORM_STATE = {
	aboutUs: "",
	mission: "",
	vision: "",
	competitiveAdvantage: "",
	keyCapabilities: [],
};

export default function StrategicPositioningForm() {
	const activeCompanyId = useGlobalStore((state) => state.activeCompanyId);
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState(INITIAL_FORM_STATE);
	const [saveError, setSaveError] = useState(null);

	const { capabilityStatement, loading, error, fetchCapabilityStatement, saveCapabilityStatement, reset } =
		useCapabilityStatementStore();

	// Fetch data only on mount and company change
	useEffect(() => {
		let mounted = true;

		const fetchData = async () => {
			if (activeCompanyId && mounted) {
				await fetchCapabilityStatement(activeCompanyId);
			}
		};

		fetchData();

		return () => {
			mounted = false;
			reset();
		};
	}, [activeCompanyId, fetchCapabilityStatement, reset]);

	// Update form when capability statement changes
	useEffect(() => {
		if (capabilityStatement) {
			setFormData({
				aboutUs: capabilityStatement.aboutUs || "",
				mission: capabilityStatement.mission || "",
				vision: capabilityStatement.vision || "",
				competitiveAdvantage: capabilityStatement.competitiveAdvantage || "",
				keyCapabilities: capabilityStatement.keyCapabilities || [],
			});
		}
	}, [capabilityStatement]);

	const updateFormData = useCallback((field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		setSaveError(null);
	}, []);

	const handleNext = () => {
		setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
	};

	const handleBack = () => {
		setActiveStep((prev) => Math.max(prev - 1, 0));
	};

	const handleSave = async () => {
		if (!activeCompanyId) return;

		setSaveError(null);
		try {
			await saveCapabilityStatement({
				...formData,
				companyId: activeCompanyId,
			});
		} catch (err) {
			console.error("Error saving capability statement:", err);
			setSaveError(err.message || "Failed to save capability statement");
		}
	};

	const renderStepContent = useCallback(() => {
		switch (activeStep) {
			case 0:
				return <AboutSection value={formData.aboutUs} onChange={(value) => updateFormData("aboutUs", value)} />;
			case 1:
				return (
					<MissionVisionSection
						mission={formData.mission}
						vision={formData.vision}
						onMissionChange={(value) => updateFormData("mission", value)}
						onVisionChange={(value) => updateFormData("vision", value)}
					/>
				);
			case 2:
				return (
					<CompetitiveSection
						value={formData.competitiveAdvantage}
						onChange={(value) => updateFormData("competitiveAdvantage", value)}
					/>
				);
			case 3:
				return (
					<CapabilitiesSection
						value={formData.keyCapabilities}
						onChange={(value) => updateFormData("keyCapabilities", value)}
					/>
				);
			case 4:
				return <ReviewSection formData={formData} />;
			default:
				return null;
		}
	}, [activeStep, formData, updateFormData]);

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to create a capability statement</Alert>
			</Box>
		);
	}

	if (loading) {
		return (
			<Box sx={{ width: "100%", mt: 4 }}>
				<LinearProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ mx: "auto", p: 3 }}>
			<Stepper activeStep={activeStep} sx={{ mb: 4 }}>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>

			<Card>
				<CardContent>
					{error && (
						<Alert severity='error' sx={{ mb: 3 }}>
							{error}
						</Alert>
					)}
					{saveError && (
						<Alert severity='error' sx={{ mb: 3 }}>
							{saveError}
						</Alert>
					)}
					{renderStepContent()}
				</CardContent>
			</Card>

			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
				<Button startIcon={<ArrowLeft />} onClick={handleBack} disabled={activeStep === 0}>
					Back
				</Button>

				{activeStep === steps.length - 1 ? (
					<Button variant='contained' onClick={handleSave} disabled={loading}>
						Save Capability Statement
					</Button>
				) : (
					<Button endIcon={<ArrowRight />} variant='contained' onClick={handleNext}>
						Next
					</Button>
				)}
			</Box>
		</Box>
	);
}
