import React from "react";
import { Box } from "@mui/material";
import { FormController } from "../common/form/FormController";
import { useStrategicPositioningStore } from "../../stores/strategicPositioningStore";
import { useGlobalStore } from "../../stores/globalStore";
import { StepperProgress } from "../common/form/StepperProgress";
import { QuestionCard } from "../common/form/QuestionCard";
import { RichTextQuestion } from "../common/form/questionTypes/RichTextQuestion";
import { SortableListQuestion } from "../common/form/questionTypes/SortableListQuestion";
import { questions } from "./questions";
import { questionInfo } from "./questionInfo";

const QUESTION_COMPONENTS = {
  richText: RichTextQuestion,
  sortableList: SortableListQuestion,
};

export default function StrategicPositioningForm() {
  const { activeCompanyId } = useGlobalStore();
  const { saveCapabilityStatement, loading, error } = useStrategicPositioningStore();

  const formSteps = questions.map((question) => ({
    id: question.id,
    title: question.title,
    component: ({ formData, onChange, errors, onInfoClick }) => {
      const QuestionComponent = QUESTION_COMPONENTS[question.type.toLowerCase()];
      return QuestionComponent ? (
        <QuestionCard title={question.title} subtitle={question.instructions}>
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
        return { [question.id]: "This field is required" };
      }
      return null;
    },
  }));

  const handleSubmit = async (formData) => {
    if (!activeCompanyId) return;

    try {
      await saveCapabilityStatement({
        companyId: activeCompanyId,
        ...formData,
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      throw err;
    }
  };

  return (
    <Box>
      <FormController
        steps={formSteps}
        initialData={{}}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        questionInfo={questionInfo}
        StepperComponent={StepperProgress}
      />
    </Box>
  );
}