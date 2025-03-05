import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { MaturityRadarChart } from "../../maturity/visualization/MaturityRadarChart";
import { SectionScoreCard } from "../../maturity/sections/SectionScoreCard";
import { processQualificationData } from "../../../utils/qualification/dataProcessing";

export function QualificationSummary({ formData }) {
  const processedData = processQualificationData(formData);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Qualification Summary
      </Typography>

      <Grid container spacing={3}>
        {/* Radar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Qualification Overview
            </Typography>
            <Box sx={{ height: 400 }}>
              <MaturityRadarChart data={processedData.radarChartData} />
            </Box>
          </Paper>
        </Grid>

        {/* Overall Score */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Overall Qualification Score
            </Typography>
            <Typography variant="h2" align="center" color="primary">
              {processedData.overallScore.toFixed(1)}
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary">
              out of 5.0
            </Typography>
          </Paper>
        </Grid>

        {/* Section Scores */}
        {processedData.sections.map((section) => (
          <Grid item xs={12} md={6} key={section.id}>
            <SectionScoreCard section={section} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}