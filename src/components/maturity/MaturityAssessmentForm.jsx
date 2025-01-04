import React from "react";
import { Box, useTheme } from "@mui/material";
import { FormController } from "../common/form/FormController";
import { questions } from "./questions";
import { questionInfo } from "./questionInfo";
import { useMaturityStore } from "../../stores/maturityStore";
import { useGlobalStore } from "../../stores/globalStore";
import { StepperProgress } from "../common/form/StepperProgress";
import { QuestionCard } from "../common/form/QuestionCard";
import { SectionQuestion } from "../common/form/questionTypes/SectionQuestion";
import { MultipleChoiceQuestion } from "../common/form/questionTypes/MultipleChoiceQuestion";
import { LikertQuestion } from "../common/form/questionTypes/LikertQuestion";
import { AssessmentSummary } from "./sections/AssessmentSummary";

const QUESTION_COMPONENTS = {
	section: SectionQuestion,
	multiplechoice: MultipleChoiceQuestion,
	likert: LikertQuestion,
};

export function MaturityAssessmentForm({ onComplete }) {
	const theme = useTheme();
	const { activeCompanyId } = useGlobalStore();
	const { saveAssessment, loading, error } = useMaturityStore();

	const formSteps = [
		...questions.map((question) => ({
			id: question.id,
			title: question.title,
			component: ({ formData, onChange, errors, onInfoClick }) => {
				const QuestionComponent = QUESTION_COMPONENTS[question.type.toLowerCase()];
				return QuestionComponent ? (
					<QuestionCard title={question.title} subtitle={question.description}>
						<QuestionComponent
							question={question}
							value={formData[question.id]}
							onChange={(value) => onChange(question.id, value)}
							error={errors?.[question.id]}
							onInfoClick={onInfoClick}
						/>
					</QuestionCard>
				) : null;
			},
			validate: (data) => {
				if (question.required && !data[question.id]) {
					return { [question.id]: "This section is required" };
				}
				return question.validation?.(data[question.id]) || null;
			},
		})),
		{
			id: "summary",
			title: "Review",
			component: ({ formData }) => <AssessmentSummary formData={formData} />,
		},
	];

	const handleSubmit = async (formData) => {
		if (!activeCompanyId) return;

		try {
			await saveAssessment({
				companyId: activeCompanyId,
				answers: formData,
				status: "COMPLETED",
				completedAt: new Date().toISOString(),
			});
			onComplete?.();
		} catch (err) {
			console.error("Error submitting assessment:", err);
			throw err;
		}
	};

	const handleSave = async (formData) => {
		if (!activeCompanyId) return;

		try {
			await saveAssessment({
				companyId: activeCompanyId,
				answers: formData,
				status: "IN_PROGRESS",
			});
		} catch (err) {
			console.error("Error saving assessment:", err);
			throw err;
		}
	};

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
				initialData={{}}
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
