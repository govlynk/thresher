import React from 'react';
import { Box, Typography, Grid, Chip, Divider } from '@mui/material';
import { FormStep } from '../../common/form/FormStep';
import { FormSection } from '../../common/form/FormSection';
import { getPlainText } from '../../../utils/richTextUtils';
import { formatDate, formatCurrency } from '../../../utils/formatters';

export function ReviewStep({ formData, onInfoClick }) {
  return (
    <FormStep
      title="Review Capability Statement"
      description="Please review your capability statement before submitting"
      onInfoClick={onInfoClick}
    >
      <FormSection title="Basic Information">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">About Us</Typography>
            <Typography variant="body1">{getPlainText(formData.aboutUs)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Mission</Typography>
            <Typography variant="body1">{getPlainText(formData.mission)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Vision</Typography>
            <Typography variant="body1">{getPlainText(formData.vision)}</Typography>
          </Grid>
          {formData.competitiveAdvantage && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Competitive Advantage</Typography>
              <Typography variant="body1">{getPlainText(formData.competitiveAdvantage)}</Typography>
            </Grid>
          )}
        </Grid>
      </FormSection>

      <FormSection title="Core Capabilities">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.keyCapabilities?.map((cap, index) => (
            <Chip key={index} label={cap} />
          ))}
        </Box>
      </FormSection>

      <FormSection title="Past Performance">
        {formData.pastPerformances?.map((perf, index) => (
          <Box key={index}>
            {index > 0 && <Divider sx={{ my: 2 }} />}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Project Name</Typography>
                <Typography variant="body1">{perf.projectName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Client</Typography>
                <Typography variant="body1">{perf.client}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Contract Value</Typography>
                <Typography variant="body1">
                  {formatCurrency(perf.contractValue)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Period</Typography>
                <Typography variant="body1">
                  {formatDate(perf.startDate)} - {formatDate(perf.endDate)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1">{perf.description}</Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
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
                <Typography variant="body1">{formatDate(cert.dateObtained)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Expiration Date
                </Typography>
                <Typography variant="body1">{formatDate(cert.expirationDate)}</Typography>
              </Grid>
              {cert.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{cert.description}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        ))}
      </FormSection>
    </FormStep>
  );
}