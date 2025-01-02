import React, { useCallback } from "react";
import { Box, Container } from "@mui/material";
import { FormController } from "../common/form/FormController";
import { questions } from "./questions";
import { questionInfo } from "./questionInfo";
import { useMaturityStore } from "../../stores/maturityStore";
import { useGlobalStore } from "../../stores/globalStore";
import { useFormAutosave } from "../../utils/form/useFormAutosave";
import { SectionQuestion } from "../common/form/questionTypes/SectionQuestion";
import { RatingQuestion } from "../common/form/questionTypes/RatingQuestion";
import { MultipleChoiceQuestion } from "../common/form/questionTypes/MultipleChoiceQuestion";
import { RichTextQuestion } from "../common/form/questionTypes/RichTextQuestion";
import { AuthorizationQuestion } from "../common/form/questionTypes/AuthorizationQuestion";
import { LikertQuestion } from "../common/form/questionTypes/LikertQuestion";
import { CodeListQuestion } from "../common/form/questionTypes/CodeListQuestion";
import { DemographicQuestion } from "../common/form/questionTypes/DemographicQuestion";

const QUESTION_COMPONENTS = {
	section: SectionQuestion,
	rating: RatingQuestion,
	multipleChoice: MultipleChoiceQuestion,
	richText: RichTextQuestion,
	authorization: AuthorizationQuestion,
	likert: LikertQuestion,
	codeList: CodeListQuestion,
	demographic: DemographicQuestion,
};

export function MaturityAssessmentForm() {
	const { assessment, saveAssessment, loading, error } = useMaturityStore();
	const { activeCompanyId } = useGlobalStore();

	// Memoize the save handler
	const handleSave = useCallback(
		async (data) => {
			if (!activeCompanyId) {
				throw new Error("Company ID is required");
			}
			await saveAssessment({
				companyId: activeCompanyId,
				answers: data,
				status: "IN_PROGRESS",
			});
		},
		[activeCompanyId, saveAssessment]
	);

	// Enable autosave with 2 second delay
	useFormAutosave({
		formData: assessment?.answers || {},
		onSave: handleSave,
		delay: 2000,
	});

	// Transform questions array into steps format expected by FormController
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
				<QuestionComponent
					question={question}
					value={formData[question.id]}
					onChange={(id, value) => onChange(id, value)}
					error={errors?.[question.id]}
					onInfoClick={onInfoClick}
				/>
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

	const handleSubmit = async (formData) => {
		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		await saveAssessment({
			companyId: activeCompanyId,
			answers: formData,
			status: "COMPLETED",
			completedAt: new Date().toISOString(),
		});
	};

	return (
		<FormController
			steps={formSteps}
			initialData={assessment?.answers || {}}
			onSubmit={handleSubmit}
			loading={loading}
			error={error}
			questionInfo={questionInfo}
		/>
	);
}
