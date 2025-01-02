import React from 'react';
import { 
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
  IconButton
} from '@mui/material';
import { Info } from 'lucide-react';

export function DemographicQuestion({ question, value = {}, onChange, onInfoClick }) {
  const handleFieldChange = (fieldName, fieldValue) => {
    onChange(question.id, {
      ...value,
      [fieldName]: fieldValue
    });
  };

  const validateField = (field, fieldValue) => {
    if (field.required && !fieldValue) {
      return `${field.label} is required`;
    }
    if (field.type === 'number') {
      const num = Number(fieldValue);
      if (field.min && num < field.min) {
        return `${field.label} must be at least ${field.min}`;
      }
      if (field.max && num > field.max) {
        return `${field.label} must be no more than ${field.max}`;
      }
    }
    return '';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h6">
          {question.title}
          {question.required && <span style={{ color: 'error.main' }}> *</span>}
        </Typography>
        <IconButton size="small" onClick={() => onInfoClick?.(question)}>
          <Info size={20} />
        </IconButton>
      </Box>

      {question.question && (
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          {question.question}
        </Typography>
      )}

      <Grid container spacing={3}>
        {question.fields.map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            {field.type === 'select' ? (
              <FormControl fullWidth>
                <InputLabel required={field.required}>
                  {field.label}
                </InputLabel>
                <Select
                  value={value[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  label={field.label}
                  error={Boolean(validateField(field, value[field.name]))}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {validateField(field, value[field.name]) && (
                  <FormHelperText error>
                    {validateField(field, value[field.name])}
                  </FormHelperText>
                )}
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label={field.label}
                type={field.type}
                value={value[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={field.required}
                error={Boolean(validateField(field, value[field.name]))}
                helperText={validateField(field, value[field.name])}
                inputProps={{
                  min: field.min,
                  max: field.max
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>

      {question.helpText && (
        <FormHelperText sx={{ mt: 2 }}>
          {question.helpText}
        </FormHelperText>
      )}
    </Box>
  );
}