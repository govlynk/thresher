import React from 'react';
import { Box, Alert } from '@mui/material';
import { CapabilityStatementForm } from '../components/capability/CapabilityStatementForm';
import { useUserCompanyStore } from '../stores/userCompanyStore';

export default function CapabilityStatementScreen() {
  const { getActiveCompany } = useUserCompanyStore();
  const activeCompany = getActiveCompany();

  if (!activeCompany) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Please select a company to manage capability statement
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <CapabilityStatementForm />
    </Box>
  );
}