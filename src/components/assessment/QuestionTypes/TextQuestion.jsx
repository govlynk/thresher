import React from 'react';
import { TextField, Box, Typography, FormHelperText } from '@mui/material';
import { QUESTION_TYPES } from '../../../config/questionTypes';

export function TextQuestion({ question, value, onChange }) {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(question.id, newValue);
  };

  const getErrorMessage = () => {
    if (!value && question.required) {
      return 'This field is required';
    }
    if (value && question.validation) {
      return question.validation(value);
    }
    if (value && question.minLength && value.length < question.minLength) {
      return `Minimum ${question.minLength} characters required`;
    }
    return '';
  };

  const error = getErrorMessage();
  const isLongText = question.type === QUESTION_TYPES.LONG_TEXT;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {question.title}
        {question.required && <span style={{ color: 'error.main' }}> *</span>}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
        {question.question}
      </Typography>

      <TextField
        fullWidth
        multiline={isLongText}
        rows={isLongText ? 4 : 1}
        value={value || ''}
        onChange={handleChange}
        error={Boolean(error)}
        helperText={
          error || 
          (question.maxLength ? 
            `${value?.length || 0}/${question.maxLength} characters` : 
            question.helpText
          )
        }
        inputProps={{
          maxLength: question.maxLength,
          minLength: question.minLength
        }}
        placeholder={question.placeholder}
        sx={{ 
          mb: 1,
          '& .MuiInputBase-root': {
            minHeight: isLongText ? '120px' : 'auto'
          }
        }}
      />

      {!error && question.helpText && (
        <FormHelperText>
          {question.helpText}
        </FormHelperText>
      )}
    </Box>
  );
}