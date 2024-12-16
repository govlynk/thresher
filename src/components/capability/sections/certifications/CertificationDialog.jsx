import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from '@mui/material';

const initialFormState = {
  name: '',
  issuer: '',
  dateObtained: '',
  expirationDate: '',
  description: '',
};

export function CertificationDialog({ open, onClose, onSave, certification, loading }) {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name || '',
        issuer: certification.issuer || '',
        dateObtained: certification.dateObtained || '',
        expirationDate: certification.expirationDate || '',
        description: certification.description || '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [certification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const certificationData = {
      ...formData,
      id: certification?.id,
    };
    onSave(certificationData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {certification ? 'Edit Certification' : 'Add New Certification'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Certification Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Issuing Organization"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date Obtained"
              name="dateObtained"
              type="date"
              value={formData.dateObtained}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expiration Date"
              name="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : certification ? 'Save Changes' : 'Add Certification'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}