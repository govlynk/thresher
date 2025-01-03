import React, { useCallback, useEffect, useState } from "react";
import { Box, Container, Button, useTheme, Alert } from "@mui/material";
import { FormController } from "../common/form/FormController";
import { questions } from "./questions";
import { questionInfo } from "./questionInfo";
import { useMaturityStore } from "../../stores/maturityStore";
import { useGlobalStore } from "../../stores/globalStore";
import { StepperProgress } from "../common/form/StepperProgress";
import { QuestionCard } from "../common/form/QuestionCard";
import { MaturityDashboard } from "./visualization/MaturityDashboard";
import { AssessmentSummary } from "./sections/AssessmentSummary";
// import { useAssessmentValidation } from "./hooks/useAssessmentValidation";
// import { useAssessmentNavigation } from "./hooks/useAssessmentNavigation";

// Import question components
import { SectionQuestion } from "../common/form/questionTypes/SectionQuestion";
import { MultipleChoiceQuestion } from "../common/form/questionTypes/MultipleChoiceQuestion";
import { LikertQuestion } from "../common/form/questionTypes/LikertQuestion";

const QUESTION_COMPONENTS = {
	section: SectionQuestion,
	multiplechoice: MultipleChoiceQuestion,
	likert: LikertQuestion,
};

export function MaturityAssessmentForm() {
	const theme = useTheme();
	const { assessment, assessments, saveAssessment, loading, error } = useMaturityStore();
	const { activeCompanyId } = useGlobalStore();
	const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
	const [isNewAssessment, setIsNewAssessment] = useState(false);

	useEffect(() => {
		// Set the most recent assessment as selected by default
		if (assessments?.length && !selectedAssessmentId) {
			setSelectedAssessmentId(assessments[0].id);
			if (assessment?.answers) {
				setFormData(JSON.parse(assessment.answers));
			}
		}
	}, [assessments, selectedAssessmentId]);

	const handleSave = useCallback(
		async (data) => {
			if (!activeCompanyId) throw new Error("Company ID is required");
			await saveAssessment({
				companyId: activeCompanyId,
				title: "Draft Assessment",
				answers: data,
				maturityScore: "",
				status: "IN_PROGRESS",
			});
		},
		[activeCompanyId, saveAssessment]
	);

	const handleSubmit = async (formData) => {
		if (!activeCompanyId) {
			return;
		}
		try {
			await saveAssessment({
				companyId: activeCompanyId,
				title,
				answers: formData,
				maturityScore,
				status: "COMPLETED",
				completedAt: new Date().toISOString(),
			});
		} catch (err) {
			console.error("Error submitting assessment:", err);
		}
	};

	const handleNewAssessment = () => {
		setSelectedAssessmentId(null);
		setIsNewAssessment(true);
	};

	// Show dashboard if there's a completed assessment and we're not creating a new one
	if (assessment?.status === "COMPLETED" && !isNewAssessment) {
		return <MaturityDashboard assessment={assessment} onNewAssessment={handleNewAssessment} />;
	}

	const formSteps = questions.map((question) => ({
		id: question.id,
		label: question.title,
		component: ({ formData, onChange, errors, onInfoClick }) => {
			const QuestionComponent = QUESTION_COMPONENTS[question.type.toLowerCase()];
			if (!QuestionComponent) {
				console.error(`No component found for question type: ${question.type}`);
				return null;
			}

			return (
				<QuestionCard title={question.title} subtitle={question.description}>
					<QuestionComponent
						question={question}
						value={formData[question.id]}
						onChange={(value) => onChange(question.id, value)}
						error={errors?.[question.id]}
						onInfoClick={onInfoClick}
					/>
				</QuestionCard>
			);
		},
		validate: (data) => {
			if (question.required && !data[question.id]) {
				return { [question.id]: "This section is required" };
			}
			if (question.validation) {
				return question.validation(data[question.id]);
			}
			return null;
		},
	}));

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
				transition: "background-color 0.3s ease",
			}}
		>
			<FormController
				steps={formSteps}
				initialData={assessment?.answers || {}}
				onSubmit={handleSubmit}
				onSave={handleSave}
				loading={loading}
				error={error}
				questionInfo={questionInfo}
				StepperComponent={StepperProgress}
			/>
		</Box>
	);
}
