import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, UserPlus, ArrowRight } from 'lucide-react';
import { useContactStore } from '../../stores/contactStore';
import { useUserStore } from '../../stores/userStore';

export function ContactSelectionDialog({ open, onClose, onContactSelected }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { contacts, fetchContacts, loading, error } = useContactStore();
  const { users } = useUserStore();
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    if (open) {
      fetchContacts();
    }
  }, [open, fetchContacts]);

  useEffect(() => {
    const filtered = contacts.filter(contact => {
      const searchStr = searchTerm.toLowerCase();
      const isMatch = 
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchStr) ||
        contact.contactEmail?.toLowerCase().includes(searchStr) ||
        contact.department?.toLowerCase().includes(searchStr);
      
      return isMatch;
    });
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  const getContactStatus = (contact) => {
    const isUser = users.some(user => user.email === contact.contactEmail);
    return isUser ? 'Active User' : 'Contact Only';
  };

  const handleContactSelect = (contact) => {
    if (users.some(user => user.email === contact.contactEmail)) {
      alert('This contact already has a user account');
      return;
    }
    onContactSelected(contact);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Contact</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <List>
              {filteredContacts.map((contact) => (
                <ListItem
                  key={contact.id}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={`${contact.firstName} ${contact.lastName}`}
                    secondary={
                      <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2" component="div">
                          {contact.contactEmail}
                        </Typography>
                        <Typography variant="body2" component="div">
                          {contact.department || 'No Department'}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={getContactStatus(contact)}
                      color={getContactStatus(contact) === 'Active User' ? 'success' : 'default'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {getContactStatus(contact) !== 'Active User' && (
                      <IconButton
                        edge="end"
                        onClick={() => handleContactSelect(contact)}
                        color="primary"
                        title="Create User Account"
                      >
                        <ArrowRight />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            {filteredContacts.length === 0 && (
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="body1" component="div" color="text.secondary">
                  No contacts found
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<UserPlus />}
                onClick={() => onContactSelected(null)}
              >
                Add New Contact
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}