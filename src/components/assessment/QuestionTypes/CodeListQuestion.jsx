import { FormControl, FormLabel, TextField, Typography } from '@mui/material'

export function CodeListQuestion({ question, value, onChange }) {
  const handleChange = (e) => {
    const newValue = e.target.value
    if (!question.validation || question.validation.test(newValue)) {
      onChange(question.id, newValue)
    }
  }

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

      <TextField
        value={value || ''}
        onChange={handleChange}
        fullWidth
        helperText="Enter valid NAICS code(s)"
      />
    </FormControl>
  )
}