import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
} from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCapabilityStatementStore } from "../../stores/capabilityStatementStore";
import { usePastPerformanceStore } from "../../stores/pastPerformanceStore";
import { useCertificationStore } from "../../stores/certificationStore";
import { StepContent } from "./components/StepContent";
import { StepNavigation } from "./components/StepNavigation";
import { useLogger } from "../../hooks/useLogger";

const steps = [
  "About Us",
  "Key Capabilities", 
  "Competitive Advantage",
  "Mission & Vision",
  "Past Performance",
  "Certifications",
  "Review",
];

const initialFormState = {
  aboutUs: "",
  keywords: "",
  keyCapabilities: [],
  competitiveAdvantage: "",
  mission: "",
  vision: "",
  performances: [],
};

export function CapabilityStatementForm() {
  const logger = useLogger('CapabilityStatementForm');
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormState);
  const [savingError, setSavingError] = useState(null);

  // Store hooks
  const {
    statement,
    loading: statementLoading,
    error: statementError,
    fetchCapabilityStatement,
    saveCapabilityStatement,
  } = useCapabilityStatementStore();

  const {
    performances,
    loading: performancesLoading,
    error: performancesError,
    fetchPerformances,
    savePerformance,
    deletePerformance,
  } = usePastPerformanceStore();

  const {
    certifications,
    loading: certificationsLoading,
    error: certificationsError,
    fetchCertifications,
  } = useCertificationStore();

  // Initial data fetch
  useEffect(() => {
    logger.debug('Fetching initial data');
    Promise.all([
      fetchCapabilityStatement(),
      fetchPerformances(),
      fetchCertifications(),
    ]).catch(err => {
      logger.error('Error fetching initial data:', err);
    });
  }, [fetchCapabilityStatement, fetchPerformances, fetchCertifications]);

  // Update form data when statement or performances change
  useEffect(() => {
    if (statement) {
      logger.debug('Updating form data from statement:', statement);
      setFormData({
        aboutUs: statement.aboutUs || "",
        keywords: statement.keywords || "",
        keyCapabilities: statement.keyCapabilities || [],
        competitiveAdvantage: statement.competitiveAdvantage || "",
        mission: statement.mission || "",
        vision: statement.vision || "",
        performances: performances || [],
      });
    }
  }, [statement, performances]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSave = async () => {
    logger.debug('Starting save process');
    setSavingError(null);
    try {
      // Save capability statement
      await saveCapabilityStatement({
        ...formData,
        lastModified: new Date().toISOString(),
      });

      // Save past performances
      if (formData.performances?.length > 0) {
        logger.debug('Saving performances:', formData.performances);
        const existingPerformanceIds = performances.map(p => p.id);
        
        // Handle new and updated performances
        for (const performance of formData.performances) {
          await savePerformance(performance);
        }

        // Handle deleted performances
        const newPerformanceIds = formData.performances.map(p => p.id).filter(Boolean);
        const deletedPerformanceIds = existingPerformanceIds.filter(
          id => !newPerformanceIds.includes(id)
        );

        for (const id of deletedPerformanceIds) {
          await deletePerformance(id);
        }
      }

      logger.debug('Save completed successfully');
    } catch (err) {
      logger.error('Error saving capability statement:', err);
      setSavingError(err.message || "Failed to save capability statement");
    }
  };

  const handlePerformanceChange = (updatedPerformances) => {
    logger.debug('Updating performances:', updatedPerformances);
    setFormData(prev => ({
      ...prev,
      performances: updatedPerformances,
    }));
  };

  const loading = statementLoading || performancesLoading || certificationsLoading;
  const error = statementError || performancesError || certificationsError || savingError;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Capability Statement
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ width: '100%', py: 4 }}>
              <LinearProgress />
            </Box>
          ) : (
            <StepContent
              activeStep={activeStep}
              formData={formData}
              setFormData={setFormData}
              handlePerformanceChange={handlePerformanceChange}
              certifications={certifications}
            />
          )}
        </CardContent>
      </Card>

      <StepNavigation
        activeStep={activeStep}
        stepsLength={steps.length}
        loading={loading}
        onBack={handleBack}
        onNext={handleNext}
        onSave={handleSave}
      />
    </Box>
  );
}