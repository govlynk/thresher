import { useMemo } from "react";
import { questions } from "../questions";

export function useAssessmentValidation(formData) {
  const isStepValid = (stepIndex) => {
    if (stepIndex >= questions.length) return true;
    
    const question = questions[stepIndex];
    if (!question.required) return true;

    const answer = formData[question.id];
    if (!answer) return false;

    // Validate based on question type
    switch (question.type) {
      case "likert":
        return Object.keys(answer).length === question.statements.length;
      case "rating":
        return Object.values(answer).every(val => val > 0);
      case "multiple_choice":
        return Array.isArray(answer) && answer.length > 0;
      default:
        return Boolean(answer);
    }
  };

  const getStepValidationErrors = (stepIndex) => {
    if (stepIndex >= questions.length) return {};
    
    const question = questions[stepIndex];
    const answer = formData[question.id];
    const errors = {};

    if (question.required && !answer) {
      errors[question.id] = "This field is required";
    }

    if (question.validation) {
      const validationError = question.validation(answer);
      if (validationError) {
        errors[question.id] = validationError;
      }
    }

    return errors;
  };

  const isFormValid = () => {
    return questions.every((_, index) => isStepValid(index));
  };

  return {
    isStepValid,
    isFormValid,
    getStepValidationErrors
  };
}