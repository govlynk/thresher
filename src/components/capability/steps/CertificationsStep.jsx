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

export default function CertificationsStep() {
  const { formData, setFormData, nextStep, prevStep } = useCapabilityStatementStore();
  const [currentCertification, setCurrentCertification] = useState({
    name: '',
    issuer: '',
    dateObtained: '',
    expirationDate: '',
    description: ''
  });

  const handleAdd = () => {
    if (currentCertification.name && currentCertification.issuer) {
      setFormData({
        certifications: [...formData.certifications, currentCertification]
      });
      setCurrentCertification({
        name: '',
        issuer: '',
        dateObtained: '',
        expirationDate: '',
        description: ''
      });
    }
  };

  const handleRemove = (index) => {
    setFormData({
      certifications: formData.certifications.filter((_, i) => i !== index)
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Certifications
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Certification Name"
              value={currentCertification.name}
              onChange={(e) => setCurrentCertification({
                ...currentCertification,
                name: e.target.value
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Issuing Organization"
              value={currentCertification.issuer}
              onChange={(e) => setCurrentCertification({
                ...currentCertification,
                issuer: e.target.value
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Obtained"
              type="date"
              value={currentCertification.dateObtained}
              onChange={(e) => setCurrentCertification({
                ...currentCertification,
                dateObtained: e.target.value
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiration Date"
              type="date"
              value={currentCertification.expirationDate}
              onChange={(e) => setCurrentCertification({
                ...currentCertification,
                expirationDate: e.target.value
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={currentCertification.description}
              onChange={(e) => setCurrentCertification({
                ...currentCertification,
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
          disabled={!currentCertification.name || !currentCertification.issuer}
        >
          Add Certification
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        {formData.certifications.map((certification, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6">{certification.name}</Typography>
                <IconButton onClick={() => handleRemove(index)} color="error">
                  <Trash2 size={20} />
                </IconButton>
              </Box>
              <Typography color="textSecondary" gutterBottom>
                {certification.issuer}
              </Typography>
              <Typography variant="body2">
                Obtained: {certification.dateObtained}
              </Typography>
              <Typography variant="body2">
                Expires: {certification.expirationDate}
              </Typography>
              {certification.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {certification.description}
                </Typography>
              )}
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