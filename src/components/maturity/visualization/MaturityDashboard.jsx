import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { Plus } from 'lucide-react';
import { MaturityRadarChart } from './MaturityRadarChart';
import { AssessmentTimeline } from './AssessmentTimeline';
import { useMaturityStore } from '../../../stores/maturityStore';
import { processAssessmentData } from '../../../utils/maturity/dataProcessing';

export function MaturityDashboard({ onNewAssessment }) {
  const { assessment, loading, error, fetchAssessment } = useMaturityStore();
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (assessment?.answers) {
      const processedData = processAssessmentData(assessment.answers);
      setChartData(processedData);
    }
  }, [assessment]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h5">Maturity Assessment Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={onNewAssessment}
        >
          New Assessment
        </Button>
      </Box>

      {assessment && (
        <>
          <AssessmentTimeline
            assessments={[assessment]}
            selectedId={selectedAssessmentId}
            onSelect={setSelectedAssessmentId}
          />
          
          {chartData && <MaturityRadarChart data={chartData} />}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date(assessment.lastModified).toLocaleString()}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}