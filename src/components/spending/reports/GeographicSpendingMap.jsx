import React from 'react';
import { Box, Typography } from '@mui/material';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { geoCentroid } from 'd3-geo';
import { format } from 'd3-format';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function GeographicSpendingMap({ data }) {
  if (!data?.results?.length) {
    return (
      <Typography color="text.secondary" align="center">
        No geographic spending data available
      </Typography>
    );
  }

  const spendingByState = data.results.reduce((acc, item) => {
    const state = item.state_code;
    acc[state] = (acc[state] || 0) + item.amount;
    return acc;
  }, {});

  const colorScale = scaleQuantize()
    .domain([0, Math.max(...Object.values(spendingByState))])
    .range([
      "#cfe2f3",
      "#9fc5e8",
      "#6fa8dc",
      "#3d85c6",
      "#0b5394"
    ]);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const centroid = geoCentroid(geo);
              const cur = spendingByState[geo.properties.postal];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={cur ? colorScale(cur) : "#EEE"}
                  stroke="#FFF"
                  strokeWidth={0.5}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Hover over states to see spending amounts
        </Typography>
      </Box>
    </Box>
  );
}