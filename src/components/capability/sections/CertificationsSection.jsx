import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  List,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Trash2, Plus } from 'lucide-react';
import { CertificationDialog } from './certifications/CertificationDialog';
import { CertificationList } from './certifications/CertificationList';
import { useCertificationStore } from '../../../stores/certificationStore';

export function CertificationsSection() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCertification, setEditCertification] = useState(null);
  const { certifications, saveCertification, deleteCertification, loading, error } = useCertificationStore();

  const handleAddClick = () => {
    setEditCertification(null);
    setDialogOpen(true);
  };

  const handleEditClick = (certification) => {
    setEditCertification(certification);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (certificationId) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await deleteCertification(certificationId);
      } catch (err) {
        console.error('Error deleting certification:', err);
      }
    }
  };

  const handleSave = async (certificationData) => {
    try {
      await saveCertification(certificationData);
      setDialogOpen(false);
      setEditCertification(null);
    } catch (err) {
      console.error('Error saving certification:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Certifications
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleAddClick}
          disabled={loading}
        >
          Add Certification
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <CertificationList
        certifications={certifications}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <CertificationDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditCertification(null);
        }}
        onSave={handleSave}
        certification={editCertification}
        loading={loading}
      />
    </Box>
  );
}