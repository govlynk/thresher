import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

export default function VendorPerformance({ data }) {
  if (!data?.results?.length) {
    return (
      <Typography color="text.secondary" align="center">
        No vendor performance data available
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Vendor</TableCell>
            <TableCell>Award Type</TableCell>
            <TableCell align="right">Award Amount</TableCell>
            <TableCell>Performance Period</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.results.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.recipient_name}</TableCell>
              <TableCell>{row.award_type}</TableCell>
              <TableCell align="right">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact'
                }).format(row.total_obligation)}
              </TableCell>
              <TableCell>
                {`${new Date(row.period_of_performance_start_date).toLocaleDateString()} - 
                  ${new Date(row.period_of_performance_end_date).toLocaleDateString()}`}
              </TableCell>
              <TableCell>
                <Chip 
                  label={row.contract_status} 
                  color={row.contract_status === 'Completed' ? 'success' : 'primary'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}