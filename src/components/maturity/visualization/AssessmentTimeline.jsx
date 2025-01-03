import React from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { formatDate } from '../../../utils/formatters';

export function AssessmentTimeline({ assessments, selectedId, onSelect }) {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth>
        <InputLabel>Assessment Version</InputLabel>
        <Select
          value={selectedId || ''}
          onChange={(e) => onSelect(e.target.value)}
          label="Assessment Version"
        >
          {assessments.map((assessment) => (
            <MenuItem key={assessment.id} value={assessment.id}>
              {`Version ${assessment.version} - ${formatDate(assessment.completedAt)}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}