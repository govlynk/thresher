import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  Chip,
  Paper
} from '@mui/material';
import { useCapabilityStatementStore } from '../../../stores/capabilityStatementStore';

export default function BasicInfoStep() {
  const { formData, setFormData, nextStep } = useCapabilityStatementStore();
  const [keywordInput, setKeywordInput] = useState('');
  const [capabilityInput, setCapabilityInput] = useState('');

  const handleKeywordAdd = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      setFormData({
        keywords: [...formData.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleCapabilityAdd = (e) => {
    if (e.key === 'Enter' && capabilityInput.trim()) {
      setFormData({
        keyCapabilities: [...formData.keyCapabilities, capabilityInput.trim()]
      });
      setCapabilityInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData({
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleRemoveCapability = (capability) => {
    setFormData({
      keyCapabilities: formData.keyCapabilities.filter(c => c !== capability)
    });
  };

  const handleSubmit = () => {
    nextStep();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="About Us"
          multiline
          rows={4}
          value={formData.aboutUs}
          onChange={(e) => setFormData({ aboutUs: e.target.value })}
        />

        <TextField
          fullWidth
          label="Mission"
          multiline
          rows={2}
          value={formData.mission}
          onChange={(e) => setFormData({ mission: e.target.value })}
        />

        <TextField
          fullWidth
          label="Vision"
          multiline
          rows={2}
          value={formData.vision}
          onChange={(e) => setFormData({ vision: e.target.value })}
        />

        <TextField
          fullWidth
          label="Competitive Advantage"
          multiline
          rows={3}
          value={formData.competitiveAdvantage}
          onChange={(e) => setFormData({ competitiveAdvantage: e.target.value })}
        />

        <Box>
          <TextField
            fullWidth
            label="Key Capabilities"
            value={capabilityInput}
            onChange={(e) => setCapabilityInput(e.target.value)}
            onKeyPress={handleCapabilityAdd}
            helperText="Press Enter to add capability"
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {formData.keyCapabilities.map((capability, index) => (
              <Chip
                key={index}
                label={capability}
                onDelete={() => handleRemoveCapability(capability)}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <TextField
            fullWidth
            label="Keywords"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={handleKeywordAdd}
            helperText="Press Enter to add keyword"
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {formData.keywords.map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                onDelete={() => handleRemoveKeyword(keyword)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.aboutUs.trim()}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}