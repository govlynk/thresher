import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { AboutReview } from './review/AboutReview';
import { CapabilitiesReview } from './review/CapabilitiesReview';
import { CompetitiveReview } from './review/CompetitiveReview';
import { MissionVisionReview } from './review/MissionVisionReview';
import { PastPerformanceReview } from './review/PastPerformanceReview';
import { CertificationsReview } from './review/CertificationsReview';

export function ReviewSection({ formData = {}, performances = [], certifications = [] }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Review Capability Statement</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <AboutReview 
          aboutUs={formData.aboutUs} 
          keywords={formData.keywords} 
        />
        <Divider sx={{ my: 2 }} />

        <CapabilitiesReview 
          capabilities={formData.keyCapabilities || []} 
        />
        <Divider sx={{ my: 2 }} />

        <CompetitiveReview 
          competitiveAdvantage={formData.competitiveAdvantage} 
        />
        <Divider sx={{ my: 2 }} />

        <MissionVisionReview 
          mission={formData.mission} 
          vision={formData.vision} 
        />
        <Divider sx={{ my: 2 }} />

        <PastPerformanceReview 
          performances={formData.performances || []} 
        />
        <Divider sx={{ my: 2 }} />

        <CertificationsReview 
          certifications={certifications} 
        />
      </Paper>
    </Box>
  );
}