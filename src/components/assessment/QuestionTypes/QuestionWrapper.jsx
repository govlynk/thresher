import React from "react";
import { BaseQuestion } from "./BaseQuestion";
import { TextQuestion } from "./TextQuestion";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { RatingQuestion } from "./RatingQuestion";
import { SliderQuestion } from "./SliderQuestion";
import { FileUploadQuestion } from "./FileUploadQuestion";
import { LikertQuestion } from "./LikertQuestion";
import { DemographicQuestion } from "./DemographicQuestion";
import { AuthorizationQuestion } from "./AuthorizationQuestion";
import { SectionQuestion } from "./SectionQuestion";
import { YesNoQuestion } from "./QuestionTypes/YesNoQuestion";
import { MultipleChoiceQuestion } from "./QuestionTypes/MultipleChoiceQuestion";
import { TextQuestion } from "./QuestionTypes/TextQuestion";
import { CodeListQuestion } from "./QuestionTypes/CodeListQuestion";
import { QUESTION_TYPES } from "../../../config/questionTypes";

const questionComponents = {
	[QUESTION_TYPES.TEXT]: TextQuestion,
	[QUESTION_TYPES.LONG_TEXT]: TextQuestion,
	[QUESTION_TYPES.YES_NO]: ChoiceQuestion,
	[QUESTION_TYPES.MULTIPLE_CHOICE]: MultipleChoiceQuestion,
	[QUESTION_TYPES.SINGLE_CHOICE]: ChoiceQuestion,
	[QUESTION_TYPES.RATING]: RatingQuestion,
	[QUESTION_TYPES.SLIDER]: SliderQuestion,
	[QUESTION_TYPES.FILE_UPLOAD]: FileUploadQuestion,
	[QUESTION_TYPES.LIKERT]: LikertQuestion,
	[QUESTION_TYPES.DEMOGRAPHIC]: DemographicQuestion,
	[QUESTION_TYPES.AUTHORIZATION]: AuthorizationQuestion,
	[QUESTION_TYPES.SECTION]: SectionQuestion,
	[QUESTION_TYPES.YES_NO]: YesNoQuestion,
	[QUESTION_TYPES.CODE_LIST]: CodeListQuestion,
};

export function QuestionWrapper({ question, value, onChange, error }) {
	const QuestionComponent = questionComponents[question.type];

	if (!QuestionComponent) {
		console.warn(`Unknown question type: ${question.type}`);
		return null;
	}

	return (
		<BaseQuestion title={question.title} question={question.question} required={question.required} error={error}>
			<QuestionComponent question={question} value={value} onChange={onChange} error={error} />
		</BaseQuestion>
	);
}
