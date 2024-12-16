import React from 'react';
import { Box, Typography } from '@mui/material';
import { SectionTitle } from './SectionTitle';

export function PastPerformanceReview({ performances = [] }) {
  return (
    <>
      <SectionTitle>Past Performance</SectionTitle>
      {performances.length > 0 ? (
        performances.map((performance, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{performance.projectName}</Typography>
            <Typography>Client: {performance.client}</Typography>
            <Typography>Value: {performance.contractValue}</Typography>
            <Typography>Period: {performance.startDate} - {performance.endDate}</Typography>
            <Typography paragraph>{performance.description}</Typography>
          </Box>
        ))
      ) : (
        <Typography paragraph>No past performance entries</Typography>
      )}
    </>
  );
}