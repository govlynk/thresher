import { FormControl, FormLabel, TextField, Typography } from '@mui/material'

export function TextQuestion({ question, value, onChange }) {
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
        multiline
        rows={4}
        value={value || ''}
        onChange={(e) => onChange(question.id, e.target.value)}
        inputProps={{ maxLength: question.maxLength }}
        helperText={`${value?.length || 0}/${question.maxLength} characters`}
        fullWidth
      />
    </FormControl>
  )
}