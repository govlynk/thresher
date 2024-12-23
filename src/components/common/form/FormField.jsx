import React from 'react';
import { Box, Typography, FormHelperText } from '@mui/material';

export function FormField({
  label,
  required,
  error,
  helperText,
  children
}) {
  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography 
          variant="subtitle2" 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {label}
          {required && (
            <Typography 
              component="span" 
              color="error" 
              sx={{ ml: 0.5 }}
            >
              *
            </Typography>
          )}
        </Typography>
      )}
      
      {children}

      {(error || helperText) && (
        <FormHelperText error={!!error}>
          {error || helperText}
        </FormHelperText>
      )}
    </Box>
  );
}