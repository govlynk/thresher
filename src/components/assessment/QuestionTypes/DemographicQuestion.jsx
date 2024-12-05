import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid
} from '@mui/material';

export function DemographicQuestion({ question, value = {}, onChange, error }) {
  const handleChange = (field, newValue) => {
    onChange({
      ...value,
      [field]: newValue
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {question.title}
        {question.required && <span style={{ color: 'error.main' }}> *</span>}
      </Typography>

      {question.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {question.description}
        </Typography>
      )}

      <Grid container spacing={2}>
        {question.fields.map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            {field.type === 'select' ? (
              <FormControl fullWidth error={Boolean(error?.[field.name])}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={value[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  label={field.label}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {error?.[field.name] && (
                  <FormHelperText>{error[field.name]}</FormHelperText>
                )}
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label={field.label}
                value={value[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                error={Boolean(error?.[field.name])}
                helperText={error?.[field.name]}
                type={field.type}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}