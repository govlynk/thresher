import React from 'react';
import { TextField, Box, Typography } from '@mui/material';

export function TextQuestion({ question, value, onChange, error }) {
  const isLongText = question.type === 'longText';

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

      <TextField
        fullWidth
        multiline={isLongText}
        rows={isLongText ? 4 : 1}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        error={Boolean(error)}
        helperText={error || (question.maxLength ? `${value?.length || 0}/${question.maxLength} characters` : '')}
        inputProps={{
          maxLength: question.maxLength,
          minLength: question.minLength,
        }}
        placeholder={question.placeholder}
      />
    </Box>
  );
}