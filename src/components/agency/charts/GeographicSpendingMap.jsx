import React from 'react';
import { ResponsiveChoropleth } from '@nivo/geo';
import { Box, Typography } from '@mui/material';
import { features } from '../../../utils/spending/usStatesGeo';
import { formatBillions } from '../../../utils/formatters';

export function GeographicSpendingMap({ data }) {
  if (!data?.length) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No geographic data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Geographic Distribution
      </Typography>
      <Box sx={{ height: 'calc(100% - 32px)' }}>
        <ResponsiveChoropleth
          data={data}
          features={features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors="blues"
          domain={[0, Math.max(...data.map(d => d.value))]}
          unknownColor="#666666"
          label="properties.name"
          valueFormat={formatBillions}
          projectionScale={900}
          projectionTranslation={[ 0.5, 0.5 ]}
          projectionRotation={[ 0, 0, 0 ]}
          enableGraticule={true}
          graticuleLineColor="rgba(0, 0, 0, .2)"
          borderWidth={0.5}
          borderColor="#152538"
          legends={[
            {
              anchor: 'bottom-left',
              direction: 'column',
              justify: true,
              translateX: 20,
              translateY: -60,
              itemsSpacing: 0,
              itemWidth: 94,
              itemHeight: 18,
              itemDirection: 'left-to-right',
              itemTextColor: '#444444',
              itemOpacity: 0.85,
              symbolSize: 18,
            }
          ]}
        />
      </Box>
    </Box>
  );
}