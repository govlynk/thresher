import React from 'react';
import { Box, Container } from '@mui/material';
import { AssessmentForm } from '../components/assessment/AssessmentForm';

// Make sure to use default export
const AssessmentScreen = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ p: 4, width: '100%' }}>
        <AssessmentForm />
      </Box>
    </Container>
  );
};

// Export as default
export default AssessmentScreen;