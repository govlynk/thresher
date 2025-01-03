import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { Box, useTheme } from '@mui/material';

export function MaturityRadarChart({ data, keys = ['current', 'target', 'benchmark'] }) {
  const theme = useTheme();

  const chartTheme = {
    textColor: theme.palette.text.primary,
    tooltip: {
      container: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
  };

  return (
    <Box sx={{ height: 500 }}>
      <ResponsiveRadar
        data={data}
        keys={keys}
        indexBy="dimension"
        maxValue={5}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={36}
        enableDots={true}
        dotSize={8}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={[theme.palette.primary.main, theme.palette.secondary.main, theme.palette.info.main]}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionConfig="gentle"
        theme={chartTheme}
        legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: theme.palette.text.secondary,
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: theme.palette.text.primary,
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
}