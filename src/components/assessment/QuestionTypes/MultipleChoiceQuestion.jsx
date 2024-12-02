import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material'

export function MultipleChoiceQuestion({ question, value, onChange }) {
  const values = value ? (Array.isArray(value) ? value : [value]) : []

  const handleChange = (option) => {
    if (question.multiple) {
      const newValues = values.includes(option)
        ? values.filter(v => v !== option)
        : [...values, option]
      onChange(question.id, newValues)
    } else {
      onChange(question.id, option)
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

      <FormGroup>
        {question.options.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                checked={values.includes(option)}
                onChange={() => handleChange(option)}
              />
            }
            label={option}
          />
        ))}
      </FormGroup>
    </FormControl>
  )
}