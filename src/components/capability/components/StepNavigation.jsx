import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function StepNavigation({
  activeStep,
  stepsLength,
  loading,
  onBack,
  onNext,
  onSave,
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
      <Button 
        startIcon={<ArrowLeft />} 
        onClick={onBack} 
        disabled={activeStep === 0 || loading}
      >
        Back
      </Button>

      {activeStep === stepsLength - 1 ? (
        <Button 
          variant="contained" 
          onClick={onSave} 
          disabled={loading}
        >
          Save Capability Statement
        </Button>
      ) : (
        <Button 
          endIcon={<ArrowRight />} 
          variant="contained" 
          onClick={onNext}
          disabled={loading}
        >
          Next
        </Button>
      )}
    </Box>
  );
}