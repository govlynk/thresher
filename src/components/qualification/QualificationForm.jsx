import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { FormController } from "../common/form/FormController";
import { questions } from "./questions";
import { questionInfo } from "./questionInfo";
import { useQualificationStore } from "../../stores/qualificationStore";
import { useGlobalStore } from "../../stores/globalStore";
import { StepperProgress } from "../common/form/StepperProgress";
import { QuestionCard } from "../common/form/QuestionCard";
import { SectionQuestion } from "../common/form/questionTypes/SectionQuestion";
import { MultipleChoiceQuestion } from "../common/form/questionTypes/MultipleChoiceQuestion";
import { LikertQuestion } from "../common/form/questionTypes/LikertQuestion";
import { QualificationSummary } from "./sections/QualificationSummary";

const QUESTION_COMPONENTS = {
	section: SectionQuestion,
	multiplechoice: MultipleChoiceQuestion,
	likert: LikertQuestion,
};

export function QualificationForm({ onComplete, initialData }) {
	const theme = useTheme();
	const { activeCompanyId } = useGlobalStore();
	const { saveQualification, loading, error } = useQualificationStore();
	const [formInitialData, setFormInitialData] = useState({});

	useEffect(() => {
		const loadInitialData = async () => {
			if (typeof initialData === "function") {
				const data = await initialData();
				setFormInitialData(data || {});
			} else {
				setFormInitialData(initialData || {});
			}
		};

		loadInitialData();
	}, [initialData]);

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
			component: ({ formData }) => <QualificationSummary formData={formData} />,
		},
	];

	const handleSubmit = async (formData) => {
		if (!activeCompanyId) return;

		try {
			await saveQualification({
				companyId: activeCompanyId,
				answers: formData,
				status: "COMPLETED",
				completedAt: new Date().toISOString(),
			});
			if (onComplete) {
				await onComplete(formData);
			}
		} catch (err) {
			console.error("Error submitting qualification:", err);
			throw err;
		}
	};

	const handleSave = async (formData) => {
		if (!activeCompanyId) return;

		try {
			await saveQualification({
				companyId: activeCompanyId,
				answers: formData,
				status: "IN_PROGRESS",
			});
		} catch (err) {
			console.error("Error saving qualification:", err);
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
				initialData={formInitialData}
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
