import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

export function ReviewSection({ formData }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Capability Statement
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>About Us</Typography>
        <Typography paragraph>{formData.aboutUs}</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Key Capabilities</Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          {formData.keyCapabilities.map((capability, index) => (
            <Typography component="li" key={index} paragraph>
              {capability}
            </Typography>
          ))}
        </Box>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Competitive Advantage</Typography>
        <Typography paragraph>{formData.competitiveAdvantage}</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Mission</Typography>
        <Typography paragraph>{formData.mission}</Typography>
        <Typography variant="h6" gutterBottom>Vision</Typography>
        <Typography paragraph>{formData.vision}</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Past Performance</Typography>
        {formData.pastPerformance.map((performance, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{performance.projectName}</Typography>
            <Typography>Client: {performance.client}</Typography>
            <Typography>Value: {performance.contractValue}</Typography>
            <Typography>Period: {performance.period}</Typography>
            <Typography paragraph>{performance.description}</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Certifications</Typography>
        {formData.certifications.map((cert, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{cert.name}</Typography>
            <Typography>Issuer: {cert.issuer}</Typography>
            <Typography>Obtained: {cert.dateObtained}</Typography>
            <Typography>Expires: {cert.expirationDate}</Typography>
            <Typography paragraph>{cert.description}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}