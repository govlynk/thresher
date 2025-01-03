import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper
} from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function PastPerformanceSection({ value = [], onChange }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    contractValue: '',
    period: '',
    description: ''
  });

  const handleAdd = () => {
    setEditIndex(-1);
    setFormData({
      projectName: '',
      client: '',
      contractValue: '',
      period: '',
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
        Past Performance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        List your significant past projects and contract performance.
      </Typography>

      <Button
        startIcon={<Plus size={20} />}
        onClick={handleAdd}
        variant="contained"
        sx={{ mb: 3 }}
      >
        Add Past Performance
      </Button>

      <List>
        {value.map((performance, index) => (
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
                primary={performance.projectName}
                secondary={
                  <Box>
                    <Typography variant="body2">
                      Client: {performance.client}
                    </Typography>
                    <Typography variant="body2">
                      Value: {performance.contractValue}
                    </Typography>
                    <Typography variant="body2">
                      Period: {performance.period}
                    </Typography>
                    <Typography variant="body2">
                      {performance.description}
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
          {editIndex === -1 ? 'Add Past Performance' : 'Edit Past Performance'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            />
            <TextField
              fullWidth
              label="Contract Value"
              value={formData.contractValue}
              onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
            />
            <TextField
              fullWidth
              label="Period of Performance"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
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