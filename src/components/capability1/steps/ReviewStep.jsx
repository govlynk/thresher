import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useCapabilityStatementStore } from '../../../stores/capabilityStatementStore';
import { useUserCompanyStore } from '../../../stores/userCompanyStore';

export default function ReviewStep() {
  const { formData, submitForm, prevStep, resetForm, loading, error } = useCapabilityStatementStore();
  const { getActiveCompany } = useUserCompanyStore();
  const activeCompany = getActiveCompany();

  const handleSubmit = async () => {
    try {
      await submitForm(activeCompany.id);
      resetForm();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Review Capability Statement
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Basic Information
          </Typography>
          <Typography variant="body1" paragraph>
            {formData.aboutUs}
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>Mission</Typography>
          <Typography variant="body1" paragraph>
            {formData.mission}
          </Typography>

          <Typography variant="subtitle2" gutterBottom>Vision</Typography>
          <Typography variant="body1" paragraph>
            {formData.vision}
          </Typography>

          <Typography variant="subtitle2" gutterBottom>Competitive Advantage</Typography>
          <Typography variant="body1" paragraph>
            {formData.competitiveAdvantage}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Key Capabilities
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.keyCapabilities.map((capability, index) => (
              <Chip key={index} label={capability} />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Keywords
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.keywords.map((keyword, index) => (
              <Chip key={index} label={keyword} variant="outlined" />
            ))}
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Past Performance ({formData.pastPerformances.length})
          </Typography>
          {formData.pastPerformances.map((performance, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{performance.projectName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {performance.client} • {formatCurrency(performance.contractValue)}
              </Typography>
              <Typography variant="body2">
                {performance.startDate} to {performance.endDate}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Certifications ({formData.certifications.length})
          </Typography>
          {formData.certifications.map((cert, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{cert.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {cert.issuer}
              </Typography>
              <Typography variant="body2">
                Valid: {cert.dateObtained} to {cert.expirationDate}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={prevStep}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Submitting...' : 'Submit Capability Statement'}
        </Button>
      </Box>
    </Paper>
  );
}