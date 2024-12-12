import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

export function AboutSection({ value, onChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Provide a comprehensive overview of your company, including your core business areas and expertise.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your company's background, expertise, and core business areas..."
        helperText={`${value.length}/2000 characters`}
        inputProps={{ maxLength: 2000 }}
      />
    </Box>
  );
}