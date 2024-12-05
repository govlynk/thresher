import React, { useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  FormHelperText,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton 
} from '@mui/material';
import { Upload, X } from 'lucide-react';

export function FileUploadQuestion({ question, value = [], onChange, error }) {
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = question.acceptedTypes.includes(file.type);
      const isValidSize = file.size <= question.maxSize;
      return isValidType && isValidSize;
    });

    if (question.multiple) {
      onChange([...value, ...validFiles]);
    } else {
      onChange(validFiles.slice(0, 1));
    }
  };

  const handleRemoveFile = (fileToRemove) => {
    onChange(value.filter(file => file !== fileToRemove));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={question.acceptedTypes.join(',')}
        multiple={question.multiple}
        onChange={handleFileChange}
      />

      <Button
        variant="outlined"
        startIcon={<Upload />}
        onClick={() => fileInputRef.current.click()}
      >
        Upload File{question.multiple ? 's' : ''}
      </Button>

      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Accepted formats: {question.acceptedTypes.join(', ')}
        <br />
        Maximum size: {formatFileSize(question.maxSize)}
      </Typography>

      {value.length > 0 && (
        <List>
          {value.map((file, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={file.name}
                secondary={formatFileSize(file.size)}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveFile(file)}
                  size="small"
                >
                  <X />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  );
}