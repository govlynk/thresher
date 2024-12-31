import React, { useEffect } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { MaturityAssessmentForm } from '../components/maturity/MaturityAssessmentForm';
import { useMaturityStore } from '../stores/maturityStore';
import { useGlobalStore } from '../stores/globalStore';

export default function MaturityAssessmentScreen() {
  const { activeCompanyId } = useGlobalStore();
  const { fetchAssessment, loading, error } = useMaturityStore();

  useEffect(() => {
    if (activeCompanyId) {
      fetchAssessment(activeCompanyId);
    }
  }, [activeCompanyId, fetchAssessment]);

  if (!activeCompanyId) {
    return (
      <Container maxWidth={false}>
        <Box sx={{ p: 4 }}>
          <Alert severity="warning">
            Please select a company to complete the maturity assessment
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          Government Contracting Maturity Assessment
        </Typography>
        <MaturityAssessmentForm />
      </Box>
    </Container>
  );
}