import React, { useState, useEffect } from "react";
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
import { useCapabilityStatementStore } from "../../stores/capabilityStatementStore";
import { AboutSection } from "./sections/AboutSection";
import { CapabilitiesSection } from "./sections/CapabilitiesSection";
import { CompetitiveSection } from "./sections/CompetitiveSection";
import { MissionVisionSection } from "./sections/MissionVisionSection";
import { PastPerformanceSection } from "./sections/PastPerformanceSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { ReviewSection } from "./sections/ReviewSection";

const steps = [
	"About Us",
	"Key Capabilities",
	"Competitive Advantage",
	"Mission & Vision",
	"Past Performance",
	"Certifications",
	"Review",
];

export function CapabilityStatementForm() {
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState({
		aboutUs: "",
		keywords: "",
		keyCapabilities: [],
		competitiveAdvantage: "",
		mission: "",
		vision: "",
		pastPerformance: [],
		certifications: [],
	});

	const { capabilityStatement, loading, error, fetchCapabilityStatement, saveCapabilityStatement } =
		useCapabilityStatementStore();

	useEffect(() => {
		fetchCapabilityStatement();
	}, [fetchCapabilityStatement]);

	useEffect(() => {
		if (capabilityStatement) {
			setFormData({
				aboutUs: capabilityStatement.aboutUs || "",
				keywords: capabilityStatement.keywords || "",
				keyCapabilities: capabilityStatement.keyCapabilities || [],
				competitiveAdvantage: capabilityStatement.competitiveAdvantage || "",
				mission: capabilityStatement.mission || "",
				vision: capabilityStatement.vision || "",
				pastPerformance: capabilityStatement.pastPerformance || [],
				certifications: capabilityStatement.certifications || [],
			});
		}
	}, [capabilityStatement]);

	const handleNext = () => {
		setActiveStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
	};

	const handleSave = async () => {
		try {
			console.log("+++saving capability data", formData);
			await saveCapabilityStatement(formData);
			// Show success message or handle completion
		} catch (err) {
			// Handle error
		}
	};

	const updateFormData = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const renderStepContent = () => {
		switch (activeStep) {
			case 0:
				return (
					<AboutSection
						aboutUs={formData.aboutUs}
						keywords={formData.keywords}
						onAboutUsChange={(value) => updateFormData("aboutUs", value)}
						onKeywordsChange={(value) => updateFormData("keywords", value)}
					/>
				);
			case 1:
				return (
					<CapabilitiesSection
						value={formData.keyCapabilities}
						onChange={(value) => updateFormData("keyCapabilities", value)}
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
					<MissionVisionSection
						mission={formData.mission}
						vision={formData.vision}
						onMissionChange={(value) => updateFormData("mission", value)}
						onVisionChange={(value) => updateFormData("vision", value)}
					/>
				);
			case 4:
				return (
					<PastPerformanceSection
						value={formData.pastPerformance}
						onChange={(value) => updateFormData("pastPerformance", value)}
					/>
				);
			case 5:
				return (
					<CertificationsSection
						value={formData.certifications}
						onChange={(value) => updateFormData("certifications", value)}
					/>
				);
			case 6:
				return <ReviewSection formData={formData} />;
			default:
				return null;
		}
	};

	if (loading) {
		return (
			<Box sx={{ width: "100%", mt: 4 }}>
				<LinearProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ mt: 4 }}>
				{error}
			</Alert>
		);
	}

	return (
		<Box sx={{ mx: "auto", p: 3 }}>
			<Typography variant='h4' gutterBottom>
				Capability Statement
			</Typography>

			<Stepper activeStep={activeStep} sx={{ mb: 4 }}>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>

			<Card>
				<CardContent>{renderStepContent()}</CardContent>
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
