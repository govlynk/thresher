import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Box, Typography } from '@mui/material';
import { formatBillions } from '../../../utils/formatters';

export function ProgramDistributionChart({ data }) {
  if (!data?.length) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No program data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Program Distribution
      </Typography>
      <Box sx={{ height: 'calc(100% - 32px)' }}>
        <ResponsiveBar
          data={data}
          keys={['amount']}
          indexBy="program_name"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          valueFormat={formatBillions}
          colors={{ scheme: 'nivo' }}
          borderColor={{ theme: 'background' }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: formatBillions,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          role="application"
        />
      </Box>
    </Box>
  );
}