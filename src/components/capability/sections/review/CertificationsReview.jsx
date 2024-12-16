import React from 'react';
import { Box, Typography } from '@mui/material';
import { SectionTitle } from './SectionTitle';

export function CertificationsReview({ certifications = [] }) {
  return (
    <>
      <SectionTitle>Certifications</SectionTitle>
      {certifications.length > 0 ? (
        certifications.map((cert, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{cert.name}</Typography>
            <Typography>Issuer: {cert.issuer}</Typography>
            <Typography>Obtained: {cert.dateObtained}</Typography>
            <Typography>Expires: {cert.expirationDate}</Typography>
            <Typography paragraph>{cert.description}</Typography>
          </Box>
        ))
      ) : (
        <Typography paragraph>No certifications listed</Typography>
      )}
    </>
  );
}