import React, { useCallback } from "react";
import { Box, Container, useTheme } from "@mui/material";
import { FormController } from "../common/form/FormController";
import { questions } from "./questions";
import { questionInfo } from "./questionInfo";
import { useMaturityStore } from "../../stores/maturityStore";
import { useGlobalStore } from "../../stores/globalStore";
import { StepperProgress } from "../common/form/StepperProgress";
import { QuestionCard } from "../common/form/QuestionCard";

// Import question components
import { SectionQuestion } from "../common/form/questionTypes/SectionQuestion";
import { RatingQuestion } from "../common/form/questionTypes/RatingQuestion";
import { MultipleChoiceQuestion } from "../common/form/questionTypes/MultipleChoiceQuestion";
import { RichTextQuestion } from "../common/form/questionTypes/RichTextQuestion";
import { AuthorizationQuestion } from "../common/form/questionTypes/AuthorizationQuestion";
import { LikertQuestion } from "../common/form/questionTypes/LikertQuestion";
import { CodeListQuestion } from "../common/form/questionTypes/CodeListQuestion";
import { FinancialQuestion } from "../common/form/questionTypes/FinancialQuestion";

const QUESTION_COMPONENTS = {
	section: SectionQuestion,
	rating: RatingQuestion,
	multiplechoice: MultipleChoiceQuestion,
	richtext: RichTextQuestion,
	authorization: AuthorizationQuestion,
	likert: LikertQuestion,
	codelist: CodeListQuestion,
	financial: FinancialQuestion,
};

export function MaturityAssessmentForm() {
	const theme = useTheme();
	const { assessment, saveAssessment, loading, error } = useMaturityStore();
	const { activeCompanyId } = useGlobalStore();

	const handleSave = useCallback(
		async (data) => {
			if (!activeCompanyId) throw new Error("Company ID is required");
			await saveAssessment({
				companyId: activeCompanyId,
				answers: data,
				status: "IN_PROGRESS",
			});
		},
		[activeCompanyId, saveAssessment]
	);

	const handleSubmit = async (formData) => {
		if (!activeCompanyId) throw new Error("No active company selected");
		await saveAssessment({
			companyId: activeCompanyId,
			answers: formData,
			status: "COMPLETED",
			completedAt: new Date().toISOString(),
		});
	};

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
