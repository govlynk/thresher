import React from 'react';
import { Typography } from '@mui/material';
import { SectionTitle } from './SectionTitle';

export function AboutReview({ aboutUs, keywords }) {
  return (
    <>
      <SectionTitle>About Us</SectionTitle>
      <Typography paragraph>{aboutUs || 'No information provided'}</Typography>
      <Typography variant="subtitle2" gutterBottom>Keywords</Typography>
      <Typography paragraph>{keywords || 'No keywords provided'}</Typography>
    </>
  );
}