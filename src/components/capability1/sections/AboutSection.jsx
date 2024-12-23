import React from 'react';
import { Box, Typography } from '@mui/material';
import { RichTextEditor } from '../../common/form/RichTextEditor/RichTextEditor';

export function AboutSection({ value, onChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Provide a comprehensive overview of your company, including your core business areas and expertise.
      </Typography>
      <RichTextEditor
        value={value}
        onChange={onChange}
        placeholder="Describe your company's background, expertise, and core business areas..."
        minHeight={300}
      />
    </Box>
  );
}