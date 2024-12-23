import React from 'react';
import { TextField, Grid, IconButton, Box, Typography } from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import { FormStep } from '../../common/form/FormStep';
import { FormSection } from '../../common/form/FormSection';
import { FormField } from '../../common/form/FormField';

export function CertificationsStep({ formData, onChange, errors, onInfoClick }) {
  const handleAddCertification = () => {
    const newCertifications = [...(formData.certifications || []), {
      name: '',
      issuer: '',
      dateObtained: '',
      expirationDate: ''
    }];
    onChange('certifications', newCertifications);
  };

  const handleRemoveCertification = (index) => {
    const newCertifications = formData.certifications.filter((_, i) => i !== index);
    onChange('certifications', newCertifications);
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...formData.certifications];
    newCertifications[index] = {
      ...newCertifications[index],
      [field]: value
    };
    onChange('certifications', newCertifications);
  };

  return (
    <FormStep
      title="Certifications"
      description="List your company's relevant certifications"
      onInfoClick={onInfoClick}
    >
      {formData.certifications?.map((cert, index) => (
        <FormSection key={index}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">Certification {index + 1}</Typography>
            <IconButton 
              onClick={() => handleRemoveCertification(index)}
              color="error"
              size="small"
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField label="Certification Name" required>
                <TextField
                  fullWidth
                  value={cert.name}
                  onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                />
              </FormField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField label="Issuing Organization" required>
                <TextField
                  fullWidth
                  value={cert.issuer}
                  onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                />
              </FormField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField label="Date Obtained">
                <TextField
                  fullWidth
                  type="date"
                  value={cert.dateObtained}
                  onChange={(e) => handleCertificationChange(index, 'dateObtained', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </FormField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField label="Expiration Date">
                <TextField
                  fullWidth
                  type="date"
                  value={cert.expirationDate}
                  onChange={(e) => handleCertificationChange(index, 'expirationDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </FormField>
            </Grid>
          </Grid>
        </FormSection>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <IconButton 
          onClick={handleAddCertification}
          color="primary"
          size="large"
        >
          <Plus size={24} />
        </IconButton>
      </Box>
    </FormStep>
  );
}