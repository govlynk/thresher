import React from 'react';
import { Box, Typography, Slider, FormHelperText } from '@mui/material';

export function SliderQuestion({ question, value, onChange, error }) {
  const marks = question.labels
    ? Object.entries(question.labels).map(([value, label]) => ({
        value: Number(value),
        label,
      }))
    : undefined;

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

      <Box sx={{ px: 2, py: 3 }}>
        <Slider
          value={Number(value) || question.min}
          onChange={(_, newValue) => onChange(newValue)}
          min={question.min}
          max={question.max}
          step={question.step}
          marks={marks}
          valueLabelDisplay="auto"
        />
      </Box>

      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  );
}