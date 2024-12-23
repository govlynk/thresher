import React from 'react';
import { Box, Container, Alert } from '@mui/material';
import { useGlobalStore } from '../stores/globalStore';
import CapabilityStatementForm from '../components/capability/CapabilityStatementForm';

// Make sure to use default export
const CapabilityStatementScreen = () => {
  const { activeCompanyId } = useGlobalStore();

  if (!activeCompanyId) {
    return (
      <Container maxWidth={false}>
        <Box sx={{ p: 4 }}>
          <Alert severity="warning">
            Please select a company to manage capability statement
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ p: 4, width: '100%' }}>
        <CapabilityStatementForm />
      </Box>
    </Container>
  );
};

// Export as default
export default CapabilityStatementScreen;