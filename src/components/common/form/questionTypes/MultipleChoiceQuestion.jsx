import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Box, IconButton } from "@mui/material";
import { Info } from 'lucide-react';

export function MultipleChoiceQuestion({ question, value, onChange, onInfoClick }) {
  const values = value ? (Array.isArray(value) ? value : [value]) : [];

  const handleChange = (option) => {
    if (question.multiple) {
      const newValues = values.includes(option) 
        ? values.filter((v) => v !== option) 
        : [...values, option];
      onChange(question.id, newValues);
    } else {
      onChange(question.id, option);
    }
  };

  return (
    <FormControl component="fieldset" fullWidth>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h6">
          {question.title}
          {question.required && <span style={{ color: 'error.main' }}> *</span>}
        </Typography>
        <IconButton size="small" onClick={() => onInfoClick?.(question)}>
          <Info size={20} />
        </IconButton>
      </Box>

      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        {question.question}
      </Typography>

      <FormGroup>
        {question.options.map((option) => (
          <FormControlLabel
            key={option}
            control={<Checkbox checked={values.includes(option)} onChange={() => handleChange(option)} />}
            label={option}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}