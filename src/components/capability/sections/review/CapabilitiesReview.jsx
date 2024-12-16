import React from 'react';
import { Box, Typography } from '@mui/material';
import { SectionTitle } from './SectionTitle';

export function CapabilitiesReview({ capabilities = [] }) {
  return (
    <>
      <SectionTitle>Key Capabilities</SectionTitle>
      <Box component="ul" sx={{ pl: 2 }}>
        {capabilities.length > 0 ? (
          capabilities.map((capability, index) => (
            <Typography component="li" key={index} paragraph>
              {capability}
            </Typography>
          ))
        ) : (
          <Typography paragraph>No capabilities listed</Typography>
        )}
      </Box>
    </>
  );
}