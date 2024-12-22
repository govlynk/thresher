import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material'

export function YesNoQuestion({ question, value, onChange }) {
  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">
        <Typography variant="h6" gutterBottom>
          {question.title}
        </Typography>
      </FormLabel>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        {question.description}
      </Typography>

      <RadioGroup
        value={value || ''}
        onChange={(e) => onChange(question.id, e.target.value)}
      >
        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="No" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  )
}