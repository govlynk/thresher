import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  FormHelperText,
  Paper
} from '@mui/material';

export function LikertQuestion({ question, value = {}, onChange, error }) {
  const handleChange = (statement, rating) => {
    onChange({
      ...value,
      [statement]: rating
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {question.title}
        {question.required && <span style={{ color: 'error.main' }}> *</span>}
      </Typography>

      {question.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {question.description}
        </Typography>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '40%' }}>Statement</TableCell>
              {question.scale.map((rating) => (
                <TableCell key={rating} align="center">
                  {rating}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {question.statements.map((statement) => (
              <TableRow key={statement}>
                <TableCell>{statement}</TableCell>
                {question.scale.map((rating) => (
                  <TableCell key={rating} align="center">
                    <Radio
                      checked={value[statement] === rating}
                      onChange={() => handleChange(statement, rating)}
                      value={rating}
                      size="small"
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  );
}