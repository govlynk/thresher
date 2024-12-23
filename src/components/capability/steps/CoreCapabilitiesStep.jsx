import React from 'react';
import { TextField, Chip, Box } from '@mui/material';
import { FormStep } from '../../common/form/FormStep';
import { FormSection } from '../../common/form/FormSection';
import { FormField } from '../../common/form/FormField';

export function CoreCapabilitiesStep({ formData, onChange, errors, onInfoClick }) {
  const [capability, setCapability] = React.useState('');

  const handleAddCapability = (e) => {
    if (e.key === 'Enter' && capability.trim()) {
      const newCapabilities = [...(formData.keyCapabilities || []), capability.trim()];
      onChange('keyCapabilities', newCapabilities);
      setCapability('');
    }
  };

  const handleRemoveCapability = (index) => {
    const newCapabilities = formData.keyCapabilities.filter((_, i) => i !== index);
    onChange('keyCapabilities', newCapabilities);
  };

  return (
    <FormStep
      title="Core Capabilities"
      description="What are your company's main capabilities and strengths?"
      onInfoClick={onInfoClick}
    >
      <FormSection>
        <FormField
          label="Add Capability"
          error={errors?.keyCapabilities}
          helperText="Press Enter to add multiple capabilities"
        >
          <TextField
            fullWidth
            value={capability}
            onChange={(e) => setCapability(e.target.value)}
            onKeyPress={handleAddCapability}
            placeholder="Type and press Enter to add"
          />
        </FormField>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {formData.keyCapabilities?.map((cap, index) => (
            <Chip
              key={index}
              label={cap}
              onDelete={() => handleRemoveCapability(index)}
            />
          ))}
        </Box>
      </FormSection>
    </FormStep>
  );
}