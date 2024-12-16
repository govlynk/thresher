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
import { usePastPerformanceStore } from "../../stores/pastPerformanceStore";
import { useCertificationStore } from "../../stores/certificationStore";
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
	});

	const {
		statement,
		loading: statementLoading,
		error: statementError,
		fetchCapabilityStatement,
		saveCapabilityStatement,
	} = useCapabilityStatementStore();

	const {
		performances,
		loading: performancesLoading,
		error: performancesError,
		fetchPerformances,
	} = usePastPerformanceStore();

	const {
		certifications,
		loading: certificationsLoading,
		error: certificationsError,
		fetchCertifications,
	} = useCertificationStore();

	useEffect(() => {
		fetchCapabilityStatement();
		fetchPerformances();
		fetchCertifications();
	}, [fetchCapabilityStatement, fetchPerformances, fetchCertifications]);

	useEffect(() => {
		if (statement) {
			setFormData({
				aboutUs: statement.aboutUs || "",
				keywords: statement.keywords || "",
				keyCapabilities: statement.keyCapabilities || [],
				competitiveAdvantage: statement.competitiveAdvantage || "",
				mission: statement.mission || "",
				vision: statement.vision || "",
			});
		}
	}, [statement]);

	const handleNext = () => {
		setActiveStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
	};

	const handleSave = async () => {
		try {
			await saveCapabilityStatement(formData);
		} catch (err) {
			console.error("Error saving capability statement:", err);
		}
	};

	const loading = statementLoading || performancesLoading || certificationsLoading;
	const error = statementError || performancesError || certificationsError;

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

	const renderStepContent = () => {
		switch (activeStep) {
			case 0:
				return (
					<AboutSection
						aboutUs={formData.aboutUs}
						keywords={formData.keywords}
						onAboutUsChange={(value) => setFormData((prev) => ({ ...prev, aboutUs: value }))}
						onKeywordsChange={(value) => setFormData((prev) => ({ ...prev, keywords: value }))}
					/>
				);
			case 1:
				return (
					<CapabilitiesSection
						value={formData.keyCapabilities}
						onChange={(value) => setFormData((prev) => ({ ...prev, keyCapabilities: value }))}
					/>
				);
			case 2:
				return (
					<CompetitiveSection
						value={formData.competitiveAdvantage}
						onChange={(value) => setFormData((prev) => ({ ...prev, competitiveAdvantage: value }))}
					/>
				);
			case 3:
				return (
					<MissionVisionSection
						mission={formData.mission}
						vision={formData.vision}
						onMissionChange={(value) => setFormData((prev) => ({ ...prev, mission: value }))}
						onVisionChange={(value) => setFormData((prev) => ({ ...prev, vision: value }))}
					/>
				);
			case 4:
				return (
					<PastPerformanceSection
						onChange={(value) => setFormData((prev) => ({ ...prev, performances: value }))}
					/>
				);
			case 5:
				return <CertificationsSection />;
			case 6:
				return <ReviewSection formData={formData} performances={performances} certifications={certifications} />;
			default:
				return null;
		}
	};

	return (
		<Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
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
