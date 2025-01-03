import { useState, useCallback } from "react";

export function useAssessmentNavigation(totalSteps, isStepValid) {
  const [currentStep, setCurrentStep] = useState(0);

  const canNavigateToStep = useCallback((targetStep) => {
    // Can always go back
    if (targetStep < currentStep) return true;
    
    // Can't skip steps
    if (targetStep > currentStep + 1) return false;
    
    // Can only proceed if current step is valid
    return isStepValid(currentStep);
  }, [currentStep, isStepValid]);

  const handleStepChange = useCallback((step) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  }, [canNavigateToStep]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps, isStepValid]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  return {
    currentStep,
    canNavigateToStep,
    handleStepChange,
    handleNext,
    handleBack
  };
}