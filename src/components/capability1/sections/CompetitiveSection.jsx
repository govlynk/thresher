import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

export function CompetitiveSection({ value, onChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Competitive Advantage
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Describe what sets your company apart from competitors and your unique value proposition.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your competitive advantages..."
        helperText={`${value.length}/1000 characters`}
        inputProps={{ maxLength: 1000 }}
      />
    </Box>
  );
}