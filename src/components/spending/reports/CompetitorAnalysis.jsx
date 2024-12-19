import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function CompetitorAnalysis({ data }) {
  if (!data?.results?.length) {
    return (
      <Typography color="text.secondary" align="center">
        No competitor data available
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Competitor</TableCell>
            <TableCell align="right">Contract Count</TableCell>
            <TableCell align="right">Total Value</TableCell>
            <TableCell align="right">Market Share</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.results.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.recipient_name}
              </TableCell>
              <TableCell align="right">{row.count}</TableCell>
              <TableCell align="right">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact'
                }).format(row.amount)}
              </TableCell>
              <TableCell align="right">
                {(row.amount / data.total * 100).toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}