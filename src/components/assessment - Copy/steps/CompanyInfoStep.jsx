import React from 'react';
import { TextField, Grid } from '@mui/material';
import { FormStep } from '../../common/form/FormStep';
import { FormSection } from '../../common/form/FormSection';
import { FormField } from '../../common/form/FormField';

export function CompanyInfoStep({ formData, onChange, errors, onInfoClick }) {
  return (
    <FormStep
      title="Company Information"
      description="Tell us about your company's basic information"
      onInfoClick={onInfoClick}
    >
      <FormSection>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormField
              label="Company Name"
              required
              error={errors?.companyName}
            >
              <TextField
                fullWidth
                name="companyName"
                value={formData.companyName || ''}
                onChange={(e) => onChange('companyName', e.target.value)}
                error={!!errors?.companyName}
              />
            </FormField>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="DUNS Number"
              required
              error={errors?.dunsNumber}
            >
              <TextField
                fullWidth
                name="dunsNumber"
                value={formData.dunsNumber || ''}
                onChange={(e) => onChange('dunsNumber', e.target.value)}
                error={!!errors?.dunsNumber}
              />
            </FormField>
          </Grid>

          <Grid item xs={12}>
            <FormField
              label="Company Description"
              required
              error={errors?.description}
            >
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formData.description || ''}
                onChange={(e) => onChange('description', e.target.value)}
                error={!!errors?.description}
              />
            </FormField>
          </Grid>
        </Grid>
      </FormSection>
    </FormStep>
  );
}