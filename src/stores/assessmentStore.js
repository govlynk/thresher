import { create } from "zustand";
import { questions } from "../config/questions";

export const useAssessmentStore = create((set) => ({
	currentStep: 0,
	answers: {},
	setAnswer: (questionId, answer) =>
		set((state) => ({
			answers: { ...state.answers, [questionId]: answer },
		})),
	nextStep: () =>
		set((state) => ({
			currentStep: Math.min(state.currentStep + 1, questions.length - 1),
		})),
	prevStep: () =>
		set((state) => ({
			currentStep: Math.max(state.currentStep - 1, 0),
		})),
}));
