import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, LinearProgress, Stepper, Step, StepLabel, IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { useAssessmentStore } from "../../stores/assessmentStore";
import { questions } from "../../config/questions";
import { questionInfo } from "../../config/questionInfo";
import { QUESTION_TYPES } from "../../config/questionTypes";
import { ResultsSummary } from "./ResultsSummary";
import { YesNoQuestion } from "./QuestionTypes/YesNoQuestion";
import { MultipleChoiceQuestion } from "./QuestionTypes/MultipleChoiceQuestion";
import { TextQuestion } from "./QuestionTypes/TextQuestion";
import { CodeListQuestion } from "./QuestionTypes/CodeListQuestion";
import { ChoiceQuestion } from "./QuestionTypes/ChoiceQuestion";
import { RatingQuestion } from "./QuestionTypes/RatingQuestion";
import { DemographicQuestion } from "./QuestionTypes/DemographicQuestion";
import { FileUploadQuestion } from "./QuestionTypes/FileUploadQuestion";
import { AuthorizationQuestion } from "./QuestionTypes/AuthorizationQuestion";
import { InfoSidebar } from "./InfoSidebar";
import { IntroScreen } from "./IntroScreen";

export function AssessmentForm() {
  const { currentStep, answers, setAnswer, nextStep, prevStep } = useAssessmentStore();
  const [showIntro, setShowIntro] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastQuestion = currentStep === questions.length - 1;

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isAnswered()) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          prevStep();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, nextStep, prevStep]);

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />;
  }

  if (showResults) {
    return <ResultsSummary />;
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      nextStep();
    }
  };

  const renderQuestion = () => {
    const props = {
      question: currentQuestion,
      value: answers[currentQuestion.id],
      onChange: (id, value) => setAnswer(id, value)
    };

    switch (currentQuestion.type) {
      case QUESTION_TYPES.YES_NO:
        return <YesNoQuestion {...props} />;
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return <MultipleChoiceQuestion {...props} />;
      case QUESTION_TYPES.TEXT:
      case QUESTION_TYPES.LONG_TEXT:
        return <TextQuestion {...props} />;
      case QUESTION_TYPES.CODE_LIST:
        return <CodeListQuestion {...props} />;
      case QUESTION_TYPES.SINGLE_CHOICE:
        return <ChoiceQuestion {...props} />;
      case QUESTION_TYPES.RATING:
        return <RatingQuestion {...props} />;
      case QUESTION_TYPES.DEMOGRAPHIC:
        return <DemographicQuestion {...props} />;
      case QUESTION_TYPES.FILE_UPLOAD:
        return <FileUploadQuestion {...props} />;
      case QUESTION_TYPES.AUTHORIZATION:
        return <AuthorizationQuestion {...props} />;
      default:
        return null;
    }
  };

  const isAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (!currentQuestion.required) return true;
    if (!answer) return false;
    
    switch (currentQuestion.type) {
      case QUESTION_TYPES.AUTHORIZATION:
        return answer.agreed && (!currentQuestion.signatureRequired || answer.signature);
      case QUESTION_TYPES.RATING:
        return currentQuestion.categories.every(category => answer[category]);
      case QUESTION_TYPES.DEMOGRAPHIC:
        return currentQuestion.fields
          .filter(field => field.required)
          .every(field => answer[field.name]);
      case QUESTION_TYPES.FILE_UPLOAD:
        return !currentQuestion.required || (answer && answer.length > 0);
      default:
        return Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
    }
  };

  return (
    <Box sx={{ mx: "auto", maxWidth: "800px" }}>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          mb: 4, 
          height: 8, 
          borderRadius: 5,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5
          }
        }} 
      />

      <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
        {questions.map((q, index) => (
          <Step key={index}>
            <StepLabel>{}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
            {renderQuestion()}
            <IconButton 
              onClick={() => setSidebarOpen(true)} 
              sx={{ ml: 2 }} 
              color="primary"
            >
              <Info />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
        <Button 
          startIcon={<ArrowLeft />} 
          onClick={prevStep} 
          disabled={currentStep === 0} 
          variant="outlined"
        >
          Previous
        </Button>

        <Button
          endIcon={isLastQuestion ? null : <ArrowRight />}
          onClick={handleNext}
          disabled={!isAnswered()}
          variant="contained"
          color="primary"
        >
          {isLastQuestion ? "Finish Assessment" : "Next"}
        </Button>
      </Box>

      <InfoSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        questionInfo={questionInfo[currentQuestion.id]}
      />
    </Box>
  );
}