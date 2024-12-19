import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';

export default function SubcontractingOpportunities({ data }) {
  if (!data?.results?.length) {
    return (
      <Typography color="text.secondary" align="center">
        No subcontracting opportunities available
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {data.results.map((opportunity, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {opportunity.recipient_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {opportunity.description}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`NAICS: ${opportunity.naics_code}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  label={new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact'
                  }).format(opportunity.total_obligation)}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}