import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

export function MissionVisionSection({ mission, vision, onMissionChange, onVisionChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mission & Vision
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Mission Statement
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Define your company's purpose and primary objectives.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={mission}
          onChange={(e) => onMissionChange(e.target.value)}
          placeholder="Enter your mission statement..."
          helperText={`${mission.length}/500 characters`}
          inputProps={{ maxLength: 500 }}
        />
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Vision Statement
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Describe your company's aspirations and future goals.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={vision}
          onChange={(e) => onVisionChange(e.target.value)}
          placeholder="Enter your vision statement..."
          helperText={`${vision.length}/500 characters`}
          inputProps={{ maxLength: 500 }}
        />
      </Box>
    </Box>
  );
}