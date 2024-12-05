import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Paper
} from '@mui/material';

export function AuthorizationQuestion({ question, value = {}, onChange, error }) {
  const handleChange = (field, newValue) => {
    onChange({
      ...value,
      [field]: newValue,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {question.title}
        {question.required && <span style={{ color: 'error.main' }}> *</span>}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {question.agreementText}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(value.agreed)}
              onChange={(e) => handleChange('agreed', e.target.checked)}
            />
          }
          label="I agree to the terms above"
        />

        {question.signatureRequired && (
          <TextField
            label="Electronic Signature"
            value={value.signature || ''}
            onChange={(e) => handleChange('signature', e.target.value)}
            fullWidth
            error={Boolean(error?.signature)}
            helperText={error?.signature}
            placeholder="Type your full name"
          />
        )}

        {value.timestamp && (
          <Typography variant="caption" color="text.secondary">
            Agreed on: {new Date(value.timestamp).toLocaleString()}
          </Typography>
        )}
      </Box>

      {error?.general && (
        <FormHelperText error>{error.general}</FormHelperText>
      )}
    </Box>
  );
}