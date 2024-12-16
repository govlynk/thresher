import React from 'react';
import { Typography } from '@mui/material';
import { SectionTitle } from './SectionTitle';

export function CompetitiveReview({ competitiveAdvantage }) {
  return (
    <>
      <SectionTitle>Competitive Advantage</SectionTitle>
      <Typography paragraph>
        {competitiveAdvantage || 'No competitive advantage information provided'}
      </Typography>
    </>
  );
}