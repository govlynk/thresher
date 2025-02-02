import React from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { AgencyDashboard } from '../components/agency/AgencyDashboard';
import { useGlobalStore } from '../stores/globalStore';

export default function AgencyAnalysisScreen() {
  const { activeCompanyId } = useGlobalStore();

  if (!activeCompanyId) {
    return (
      <Container maxWidth={false}>
        <Box sx={{ p: 4 }}>
          <Alert severity="warning">
            Please select a company to view agency analysis
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Federal Agency Analysis
      </Typography>
      <AgencyDashboard />
    </Box>
  );
}