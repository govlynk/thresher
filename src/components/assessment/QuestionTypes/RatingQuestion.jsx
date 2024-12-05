import React from 'react';
import { Box, Typography, Rating, FormHelperText } from '@mui/material';
import { Star } from 'lucide-react';

export function RatingQuestion({ question, value, onChange, error }) {
  const StarIcon = () => (
    <Star 
      size={24}
      style={{
        fill: 'currentColor',
        stroke: 'currentColor',
        strokeWidth: 1
      }}
    />
  );

  const EmptyStarIcon = () => (
    <Star 
      size={24}
      style={{
        fill: 'transparent',
        stroke: 'currentColor',
        strokeWidth: 1
      }}
    />
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {question.title}
        {question.required && <span style={{ color: 'error.main' }}> *</span>}
      </Typography>

      {question.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {question.description}
        </Typography>
      )}

      <Rating
        value={Number(value) || 0}
        onChange={(event, newValue) => onChange(newValue)}
        max={question.maxRating || 5}
        icon={<StarIcon />}
        emptyIcon={<EmptyStarIcon />}
        sx={{
          '& .MuiRating-icon': {
            color: 'primary.main'
          }
        }}
      />

      {question.labels && value && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {question.labels[value]}
        </Typography>
      )}

      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  );
}