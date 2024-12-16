import React from 'react';
import {
  List,
  Paper,
  ListItem,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';

export function CertificationList({ certifications = [], onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!certifications.length) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
        No certifications added yet
      </Typography>
    );
  }

  return (
    <List>
      {certifications.map((cert) => (
        <Paper key={cert.id} sx={{ mb: 2 }}>
          <ListItem
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              p: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
              <Typography variant="subtitle1">{cert.name}</Typography>
              <Box>
                <IconButton onClick={() => onEdit(cert)} size="small">
                  <Edit size={18} />
                </IconButton>
                <IconButton onClick={() => onDelete(cert.id)} size="small" color="error">
                  <Trash2 size={18} />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2">Issuer: {cert.issuer}</Typography>
            <Typography variant="body2">
              Obtained: {new Date(cert.dateObtained).toLocaleDateString()}
            </Typography>
            {cert.expirationDate && (
              <Typography variant="body2">
                Expires: {new Date(cert.expirationDate).toLocaleDateString()}
              </Typography>
            )}
            {cert.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {cert.description}
              </Typography>
            )}
          </ListItem>
        </Paper>
      ))}
    </List>
  );
}