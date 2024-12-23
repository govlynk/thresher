import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export function FormSection({ title, description, children }) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {title && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
      )}
      {children}
    </Paper>
  );
}