import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography } from '@mui/material';
import { formatBillions } from '../../../utils/formatters';

export function BudgetAllocationChart({ data }) {
  if (!data?.length) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No budget data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Budget Allocation
      </Typography>
      <Box sx={{ height: 'calc(100% - 32px)' }}>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ theme: 'background' }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={{ theme: 'text.secondary' }}
          arcLabelsSkipAngle={10}
          valueFormat={formatBillions}
          colors={{ scheme: 'nivo' }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
            }
          ]}
        />
      </Box>
    </Box>
  );
}