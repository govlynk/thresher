import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Paper,
  Alert,
  IconButton
} from '@mui/material';
import { Info } from 'lucide-react';

export function AuthorizationQuestion({ question, value = {}, onChange, onInfoClick }) {
  const handleChange = (field, newValue) => {
    const updatedValue = {
      ...value,
      [field]: newValue,
      timestamp: new Date().toISOString()
    };
    onChange(question.id, updatedValue);
  };

  const error = question.validation?.(value);

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

      <Paper 
        variant="outlined" 
        sx={{ 
          p: 3, 
          mb: 3,
          bgcolor: 'background.default',
          maxHeight: '300px',
          overflowY: 'auto'
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace'
          }}
        >
          {question.agreementText}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(value?.agreed)}
              onChange={(e) => handleChange('agreed', e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="body1">
              I agree to the terms above
              {question.required && <span style={{ color: 'error.main' }}> *</span>}
            </Typography>
          }
        />

        {question.signatureRequired && (
          <TextField
            label="Electronic Signature"
            value={value?.signature || ''}
            onChange={(e) => handleChange('signature', e.target.value)}
            fullWidth
            required={question.required}
            placeholder="Type your full name"
            helperText="Please type your full name as your electronic signature"
          />
        )}

        {value?.timestamp && (
          <Typography variant="caption" color="text.secondary">
            Agreed on: {new Date(value.timestamp).toLocaleString()}
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </Box>

      {question.helpText && (
        <FormHelperText sx={{ mt: 2 }}>
          {question.helpText}
        </FormHelperText>
      )}
    </Box>
  );
}