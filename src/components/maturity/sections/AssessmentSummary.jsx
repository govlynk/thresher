import React from "react";
import { Box, Typography, Button, Paper, Grid, CircularProgress } from "@mui/material";
import { MaturityRadarChart } from "../visualization/MaturityRadarChart";
import { SectionScoreCard } from "./SectionScoreCard";
import { processAssessmentData } from "../../../utils/maturity/dataProcessing";

export function AssessmentSummary({ formData, onSubmit, onBack, loading }) {
  const processedData = processAssessmentData(formData);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assessment Summary
      </Typography>

      <Grid container spacing={3}>
        {/* Radar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Maturity Overview
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
              Overall Maturity Score
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

      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Submitting..." : "Submit Assessment"}
        </Button>
      </Box>
    </Box>
  );
}