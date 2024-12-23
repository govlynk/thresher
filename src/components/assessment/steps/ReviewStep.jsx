import React from 'react';
import { Box, Typography, Grid, Chip, Divider } from '@mui/material';
import { FormStep } from '../../common/form/FormStep';
import { FormSection } from '../../common/form/FormSection';

export function ReviewStep({ formData, onInfoClick }) {
  return (
    <FormStep
      title="Review Information"
      description="Please review your assessment information before submitting"
      onInfoClick={onInfoClick}
    >
      <FormSection title="Company Information">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Company Name</Typography>
            <Typography variant="body1">{formData.companyName}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">DUNS Number</Typography>
            <Typography variant="body1">{formData.dunsNumber}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Description</Typography>
            <Typography variant="body1">{formData.description}</Typography>
          </Grid>
        </Grid>
      </FormSection>

      <FormSection title="Core Capabilities">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.capabilities?.map((cap, index) => (
            <Chip key={index} label={cap} />
          ))}
        </Box>
      </FormSection>

      <FormSection title="Certifications">
        {formData.certifications?.map((cert, index) => (
          <Box key={index}>
            {index > 0 && <Divider sx={{ my: 2 }} />}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Certification Name
                </Typography>
                <Typography variant="body1">{cert.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Issuing Organization
                </Typography>
                <Typography variant="body1">{cert.issuer}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date Obtained
                </Typography>
                <Typography variant="body1">
                  {cert.dateObtained ? new Date(cert.dateObtained).toLocaleDateString() : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Expiration Date
                </Typography>
                <Typography variant="body1">
                  {cert.expirationDate ? new Date(cert.expirationDate).toLocaleDateString() : '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </FormSection>
    </FormStep>
  );
}