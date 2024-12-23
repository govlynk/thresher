import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function CertificationsSection({ value = [], onChange }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    dateObtained: '',
    expirationDate: '',
    description: ''
  });

  const handleAdd = () => {
    setEditIndex(-1);
    setFormData({
      name: '',
      issuer: '',
      dateObtained: '',
      expirationDate: '',
      description: ''
    });
    setDialogOpen(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(value[index]);
    setDialogOpen(true);
  };

  const handleDelete = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newValue = [...value];
    if (editIndex === -1) {
      newValue.push(formData);
    } else {
      newValue[editIndex] = formData;
    }
    onChange(newValue);
    setDialogOpen(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Certifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        List your company's certifications and qualifications.
      </Typography>

      <Button
        startIcon={<Plus size={20} />}
        onClick={handleAdd}
        variant="contained"
        sx={{ mb: 3 }}
      >
        Add Certification
      </Button>

      <List>
        {value.map((cert, index) => (
          <Paper key={index} sx={{ mb: 2, p: 2 }}>
            <ListItem
              disablePadding
              secondaryAction={
                <Box>
                  <IconButton onClick={() => handleEdit(index)}>
                    <Edit size={18} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)}>
                    <Trash2 size={18} />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={cert.name}
                secondary={
                  <Box>
                    <Typography variant="body2">
                      Issuer: {cert.issuer}
                    </Typography>
                    <Typography variant="body2">
                      Obtained: {cert.dateObtained}
                    </Typography>
                    <Typography variant="body2">
                      Expires: {cert.expirationDate}
                    </Typography>
                    <Typography variant="body2">
                      {cert.description}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex === -1 ? 'Add Certification' : 'Edit Certification'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Certification Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Issuing Organization"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            />
            <TextField
              fullWidth
              label="Date Obtained"
              type="date"
              value={formData.dateObtained}
              onChange={(e) => setFormData({ ...formData, dateObtained: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Expiration Date"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}