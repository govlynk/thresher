import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useContactStore } from '../../stores/contactStore';
import { useUserCompanyStore } from '../../stores/userCompanyStore';

export function ContactCreationDialog({ open, onClose, onContactCreated }) {
  const { addContact, loading, error } = useContactStore();
  const { getActiveCompany } = useUserCompanyStore();
  const activeCompany = getActiveCompany();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    department: '',
    contactEmail: '',
    contactMobilePhone: '',
    contactBusinessPhone: '',
    notes: '',
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        firstName: '',
        lastName: '',
        title: '',
        department: '',
        contactEmail: '',
        contactMobilePhone: '',
        contactBusinessPhone: '',
        notes: '',
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName?.trim()) return 'First name is required';
    if (!formData.lastName?.trim()) return 'Last name is required';
    if (!formData.contactEmail?.trim()) return 'Email is required';
    if (!activeCompany?.id) return 'No active company selected';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const contactData = {
        ...formData,
        companyId: activeCompany.id,
        dateLastContacted: new Date().toISOString(),
      };

      const newContact = await addContact(contactData);
      onContactCreated(newContact);
    } catch (err) {
      console.error('Error creating contact:', err);
    }
  };

  if (!activeCompany) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Alert severity="error">
            Please select a company before creating a contact
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Contact</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Creating contact for: {activeCompany.legalBusinessName}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Phone"
                name="contactMobilePhone"
                value={formData.contactMobilePhone}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Phone"
                name="contactBusinessPhone"
                value={formData.contactBusinessPhone}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </Box>
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
          {loading ? 'Creating...' : 'Create Contact'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}