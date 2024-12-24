import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  IconButton,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import { useCapabilityStatementStore } from '../../../stores/capabilityStatementStore';

export default function PastPerformanceStep() {
  const { formData, setFormData, nextStep, prevStep } = useCapabilityStatementStore();
  const [currentPerformance, setCurrentPerformance] = useState({
    projectName: '',
    client: '',
    contractValue: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleAdd = () => {
    if (currentPerformance.projectName && currentPerformance.client) {
      setFormData({
        pastPerformances: [...formData.pastPerformances, {
          ...currentPerformance,
          contractValue: parseFloat(currentPerformance.contractValue) || 0
        }]
      });
      setCurrentPerformance({
        projectName: '',
        client: '',
        contractValue: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  };

  const handleRemove = (index) => {
    setFormData({
      pastPerformances: formData.pastPerformances.filter((_, i) => i !== index)
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Past Performance
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Project Name"
              value={currentPerformance.projectName}
              onChange={(e) => setCurrentPerformance({
                ...currentPerformance,
                projectName: e.target.value
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Client"
              value={currentPerformance.client}
              onChange={(e) => setCurrentPerformance({
                ...currentPerformance,
                client: e.target.value
              })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Contract Value"
              type="number"
              value={currentPerformance.contractValue}
              onChange={(e) => setCurrentPerformance({
                ...currentPerformance,
                contractValue: e.target.value
              })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={currentPerformance.startDate}
              onChange={(e) => setCurrentPerformance({
                ...currentPerformance,
                startDate: e.target.value
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={currentPerformance.endDate}
              onChange={(e) => setCurrentPerformance({
                ...currentPerformance,
                endDate: e.target.value
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={currentPerformance.description}
              onChange={(e) => setCurrentPerformance({
                ...currentPerformance,
                description: e.target.value
              })}
            />
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          startIcon={<Plus />}
          onClick={handleAdd}
          sx={{ mt: 2 }}
          disabled={!currentPerformance.projectName || !currentPerformance.client}
        >
          Add Performance
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        {formData.pastPerformances.map((performance, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6">{performance.projectName}</Typography>
                <IconButton onClick={() => handleRemove(index)} color="error">
                  <Trash2 size={20} />
                </IconButton>
              </Box>
              <Typography color="textSecondary" gutterBottom>
                {performance.client}
              </Typography>
              <Typography variant="body2">
                Contract Value: ${performance.contractValue.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Period: {performance.startDate} to {performance.endDate}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {performance.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={prevStep}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={nextStep}
        >
          Next
        </Button>
      </Box>
    </Paper>
  );
}