import React from 'react';
import { Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Trash2 } from 'lucide-react';

export function ContactsTable({ contacts, onEdit, onDelete }) {
  const columns = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => onEdit(params.row)}>
            <Edit size={18} />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => onDelete(params.row.id)}
            color="error"
          >
            <Trash2 size={18} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <DataGrid
      rows={contacts}
      columns={columns}
      autoHeight
      disableSelectionOnClick
      sx={{ mb: 3 }}
    />
  );
}