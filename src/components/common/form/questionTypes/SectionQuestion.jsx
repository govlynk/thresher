import React from "react";
import { Box, Typography, Paper, Divider, IconButton } from "@mui/material";
import { Info } from "lucide-react";
import { TextQuestion } from "./TextQuestion";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { RatingQuestion } from "./RatingQuestion";
import { SliderQuestion } from "./SliderQuestion";
import { FileUploadQuestion } from "./FileUploadQuestion";
import { LikertQuestion } from "./LikertQuestion";
import { DemographicQuestion } from "./DemographicQuestion";
import { AuthorizationQuestion } from "./AuthorizationQuestion";
import { QUESTION_TYPES } from "../questionTypes";

const questionComponents = {
	[QUESTION_TYPES.TEXT]: TextQuestion,
	[QUESTION_TYPES.LONG_TEXT]: TextQuestion,
	[QUESTION_TYPES.MULTIPLE_CHOICE]: ChoiceQuestion,
	[QUESTION_TYPES.SINGLE_CHOICE]: ChoiceQuestion,
	[QUESTION_TYPES.RATING]: RatingQuestion,
	[QUESTION_TYPES.SLIDER]: SliderQuestion,
	[QUESTION_TYPES.FILE_UPLOAD]: FileUploadQuestion,
	[QUESTION_TYPES.LIKERT]: LikertQuestion,
	[QUESTION_TYPES.DEMOGRAPHIC]: DemographicQuestion,
	[QUESTION_TYPES.AUTHORIZATION]: AuthorizationQuestion,
};

export function SectionQuestion({ question, value = {}, onChange, error = {}, onInfoClick = {} }) {
	const handleQuestionChange = (questionId, questionValue) => {
		onChange({
			...value,
			[questionId]: questionValue,
		});
	};

	return (
		<Box sx={{ mb: 4 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
				<Typography variant='h5' gutterBottom>
					{question.title}
				</Typography>
				{onInfoClick && (
					<IconButton size='small' onClick={() => onInfoClick(question)}>
						<Info size={20} />
					</IconButton>
				)}
			</Box>
			{question.description && (
				<Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
					{question.description}
				</Typography>
			)}

			<Paper variant='outlined' sx={{ p: 3 }}>
				{question.questions.map((subQuestion, index) => {
					const QuestionComponent = questionComponents[subQuestion.type];

					if (!QuestionComponent) {
						console.warn(`Unknown question type: ${subQuestion.type}`);
						return null;
					}

					return (
						<Box key={subQuestion.id}>
							<QuestionComponent
								question={subQuestion}
								value={value[subQuestion.id]}
								onChange={(newValue) => handleQuestionChange(subQuestion.id, newValue)}
								error={error[subQuestion.id]}
							/>
							{index < question.questions.length - 1 && <Divider sx={{ my: 3 }} />}
						</Box>
					);
				})}
			</Paper>
		</Box>
	);
}
