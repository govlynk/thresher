import React from 'react';
import { Typography } from '@mui/material';

export function SectionTitle({ children }) {
  return (
    <Typography variant="h6" gutterBottom>
      {children}
    </Typography>
  );
}