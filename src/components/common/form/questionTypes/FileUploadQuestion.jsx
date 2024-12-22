import React, { useRef, useState } from 'react';
import { 
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  FormHelperText,
  Alert
} from '@mui/material';
import { Upload, X, FileText, Image, File } from 'lucide-react';

export function FileUploadQuestion({ question, value = [], onChange }) {
  const fileInputRef = useRef();
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image size={20} />;
    if (fileType.includes('pdf')) return <FileText size={20} />;
    return <File size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validateFile = (file) => {
    // Check file type
    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
    if (!question.acceptedTypes.includes(fileExtension)) {
      return `Invalid file type. Accepted types: ${question.acceptedTypes.join(', ')}`;
    }

    // Check file size
    if (file.size > question.maxSize) {
      return `File too large. Maximum size: ${formatFileSize(question.maxSize)}`;
    }

    return '';
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    setError('');
    setUploading(true);

    try {
      // Validate total number of files
      if (value.length + files.length > question.maxFiles) {
        throw new Error(`Maximum ${question.maxFiles} files allowed`);
      }

      // Validate each file
      const validFiles = [];
      for (const file of files) {
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(`${file.name}: ${validationError}`);
        }
        validFiles.push(file);
      }

      // Custom validation if provided
      if (question.validation) {
        const validationError = question.validation([...value, ...validFiles]);
        if (validationError) {
          throw new Error(validationError);
        }
      }

      // Update files
      onChange(question.id, [...value, ...validFiles]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    const newFiles = value.filter((_, index) => index !== indexToRemove);
    onChange(question.id, newFiles);
    setError('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {question.title}
        {question.required && <span style={{ color: 'error.main' }}> *</span>}
      </Typography>

      {question.question && (
        <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
          {question.question}
        </Typography>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept={question.acceptedTypes.join(',')}
        multiple={question.maxFiles > 1}
      />

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Upload />}
          onClick={() => fileInputRef.current.click()}
          disabled={uploading || (value.length >= question.maxFiles)}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>

        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          Accepted formats: {question.acceptedTypes.join(', ')}
          <br />
          Maximum size: {formatFileSize(question.maxSize)}
          {question.maxFiles > 1 && ` • Maximum files: ${question.maxFiles}`}
        </Typography>
      </Box>

      {uploading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {value.map((file, index) => (
          <ListItem
            key={index}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 1,
              mb: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ mr: 2, color: 'primary.main' }}>
              {getFileIcon(file.type)}
            </Box>
            <ListItemText
              primary={file.name}
              secondary={formatFileSize(file.size)}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleRemoveFile(index)}
                size="small"
                color="error"
              >
                <X size={20} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {question.helpText && (
        <FormHelperText>
          {question.helpText}
        </FormHelperText>
      )}
    </Box>
  );
}