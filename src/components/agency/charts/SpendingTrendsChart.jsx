import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Box, Typography, useTheme } from '@mui/material';
import { formatBillions } from '../../../utils/formatters';

export function SpendingTrendsChart({ data = [] }) {
  const theme = useTheme();

  if (!data.length) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No spending data available</Typography>
      </Box>
    );
  }

  // Process data for visualization
  const chartData = data
    .sort((a, b) => (b.total_obligations || 0) - (a.total_obligations || 0))
    .slice(0, 5) // Show top 5 for better visibility
    .map(item => ({
      name: item.name,
      'Total Obligations': item.total_obligations || 0,
      'Total Outlays': item.total_outlays || 0,
      'Total Resources': item.total_budgetary_resources || 0,
    }));

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Top 5 Sub-Agency Spending
      </Typography>
      <Box sx={{ height: 'calc(100% - 32px)' }}>
        <ResponsiveBar
          data={chartData}
          keys={['Total Obligations', 'Total Outlays', 'Total Resources']}
          indexBy="name"
          margin={{ top: 50, right: 130, bottom: 50, left: 80 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          valueFormat={formatBillions}
          colors={{ scheme: 'nivo' }}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: theme.palette.text.secondary,
                  fontSize: 11,
                },
              },
              legend: {
                text: {
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                },
              },
            },
            legends: {
              text: {
                fill: theme.palette.text.secondary,
                fontSize: 11,
              },
            },
            tooltip: {
              container: {
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                fontSize: '12px',
                borderRadius: '4px',
                boxShadow: theme.shadows[3],
              },
            },
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Sub-Agency',
            legendPosition: 'middle',
            legendOffset: 40,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Amount (Billions)',
            legendPosition: 'middle',
            legendOffset: -60,
            format: formatBillions,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          role="application"
          ariaLabel="Sub-Agency Spending Comparison"
          barAriaLabel={e => `${e.id}: ${formatBillions(e.formattedValue)} for ${e.indexValue}`}
        />
      </Box>
    </Box>
  );
}