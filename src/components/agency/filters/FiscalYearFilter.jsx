import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FISCAL_YEARS = Array.from(
  { length: 10 }, 
  (_, i) => new Date().getFullYear() - i
);

export function FiscalYearFilter({ value, onChange }) {
  return (
    <FormControl sx={{ minWidth: 150 }}>
      <InputLabel>Fiscal Year</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Fiscal Year"
      >
        {FISCAL_YEARS.map(year => (
          <MenuItem key={year} value={year}>
            FY {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}