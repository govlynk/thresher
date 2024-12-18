import React from "react";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Box } from "@mui/material";
import { QUESTION_TYPES } from '../../../config/questionTypes';

export function ChoiceQuestion({ question, value, onChange }) {
  const handleChange = (e) => {
    onChange(question.id, e.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {question.title}
        {question.required && <span style={{ color: 'error.main' }}> *</span>}
      </Typography>

      <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
        {question.question}
      </Typography>

      <FormControl component="fieldset" fullWidth>
        <RadioGroup 
          value={value || ""}
          onChange={handleChange}
          sx={{
            '& .MuiFormControlLabel-root': {
              marginY: 1
            }
          }}
        >
          {question.options.map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={
                <Radio 
                  sx={{
                    '&.Mui-checked': {
                      color: 'primary.main'
                    }
                  }}
                />
              }
              label={
                <Typography variant="body1">
                  {option}
                </Typography>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>

      {question.helpText && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {question.helpText}
        </Typography>
      )}
    </Box>
  );
}