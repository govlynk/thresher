import React from 'react';
import { Typography } from '@mui/material';
import { SectionTitle } from './SectionTitle';

export function MissionVisionReview({ mission, vision }) {
  return (
    <>
      <SectionTitle>Mission</SectionTitle>
      <Typography paragraph>{mission || 'No mission statement provided'}</Typography>
      
      <SectionTitle>Vision</SectionTitle>
      <Typography paragraph>{vision || 'No vision statement provided'}</Typography>
    </>
  );
}