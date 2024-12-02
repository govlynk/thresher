import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Plus } from 'lucide-react';

export function TodoHeader({ onAddClick }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 4
    }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        Tasks
      </Typography>
      <Button
        variant="contained"
        startIcon={<Plus size={20} />}
        onClick={onAddClick}
        sx={{ px: 3 }}
      >
        Add Task
      </Button>
    </Box>
  );
}