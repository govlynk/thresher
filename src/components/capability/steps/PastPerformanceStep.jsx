import React from 'react';
import { TextField, Grid, IconButton, Box, Typography } from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import { FormStep } from '../../common/form/FormStep';
import { FormSection } from '../../common/form/FormSection';
import { FormField } from '../../common/form/FormField';

export function PastPerformanceStep({ formData, onChange, errors, onInfoClick }) {
  const handleAddPerformance = () => {
    const newPerformances = [...(formData.pastPerformances || []), {
      projectName: '',
      client: '',
      contractValue: '',
      startDate: '',
      endDate: '',
      description: ''
    }];
    onChange('pastPerformances', newPerformances);
  };

  const handleRemovePerformance = (index) => {
    const newPerformances = formData.pastPerformances.filter((_, i) => i !== index);
    onChange('pastPerformances', newPerformances);
  };

  const handlePerformanceChange = (index, field, value) => {
    const newPerformances = [...formData.pastPerformances];
    newPerformances[index] = {
      ...newPerformances[index],
      [field]: value
    };
    onChange('pastPerformances', newPerformances);
  };

  return (
    <FormStep
      title="Past Performance"
      description="List your company's relevant past performance examples"
      onInfoClick={onInfoClick}
    >
      {formData.pastPerformances?.map((perf, index) => (
        <FormSection key={index}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">Past Performance {index + 1}</Typography>
            <IconButton 
              onClick={() => handleRemovePerformance(index)}
              color="error"
              size="small"
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField label="Project Name" required>
                <TextField
                  fullWidth
                  value={perf.projectName}
                  onChange={(e) => handlePerformanceChange(index, 'projectName', e.target.value)}
                />
              </FormField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField label="Client" required>
                <TextField
                  fullWidth
                  value={perf.client}
                  onChange={(e) => handlePerformanceChange(index, 'client', e.target.value)}
                />
              </FormField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField label="Contract Value">
                <TextField
                  fullWidth
                  type="number"
                  value={perf.contractValue}
                  onChange={(e) => handlePerformanceChange(index, 'contractValue', e.target.value)}
                />
              </FormField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField label="Start Date">
                <TextField
                  fullWidth
                  type="date"
                  value={perf.startDate}
                  onChange={(e) => handlePerformanceChange(index, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </FormField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField label="End Date">
                <TextField
                  fullWidth
                  type="date"
                  value={perf.endDate}
                  onChange={(e) => handlePerformanceChange(index, 'endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </FormField>
            </Grid>
            <Grid item xs={12}>
              <FormField label="Description">
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={perf.description}
                  onChange={(e) => handlePerformanceChange(index, 'description', e.target.value)}
                />
              </FormField>
            </Grid>
          </Grid>
        </FormSection>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <IconButton 
          onClick={handleAddPerformance}
          color="primary"
          size="large"
        >
          <Plus size={24} />
        </IconButton>
      </Box>
    </FormStep>
  );
}