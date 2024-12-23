import React, { useRef, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { Box, Paper } from '@mui/material';
import { EditorToolbar } from './EditorToolbar';
import 'draft-js/dist/Draft.css';

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  minHeight = 200,
  readOnly = false,
  error = false 
}) {
  const [editorState, setEditorState] = React.useState(() => {
    if (value) {
      try {
        // Try to parse stored content
        const contentState = convertFromRaw(JSON.parse(value));
        return EditorState.createWithContent(contentState);
      } catch (e) {
        console.warn('Invalid editor content:', e);
        // Fallback to empty editor
        return EditorState.createEmpty();
      }
    }
    return EditorState.createEmpty();
  });

  const editorRef = useRef(null);
  const valueRef = useRef(value);

  // Update editor state when value prop changes
  useEffect(() => {
    if (value !== valueRef.current) {
      valueRef.current = value;
      if (value) {
        try {
          const contentState = convertFromRaw(JSON.parse(value));
          const newEditorState = EditorState.createWithContent(contentState);
          setEditorState(newEditorState);
        } catch (e) {
          console.warn('Invalid editor content:', e);
        }
      } else {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [value]);

  const handleChange = (newState) => {
    setEditorState(newState);
  };

  const handleToggle = (type, style) => {
    const newState = type === 'block'
      ? RichUtils.toggleBlockType(editorState, style)
      : RichUtils.toggleInlineStyle(editorState, style);
    handleChange(newState);
  };

  const handleBlur = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    const contentStr = JSON.stringify(content);

    // Only trigger onChange if content has actually changed
    if (contentStr !== valueRef.current) {
      valueRef.current = contentStr;
      onChange(contentStr);
    }
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const focusEditor = () => {
    if (editorRef.current && !readOnly) {
      editorRef.current.focus();
    }
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        border: error ? '1px solid red' : undefined,
        '&:hover': {
          borderColor: error ? 'red' : 'primary.main'
        }
      }}
    >
      {!readOnly && (
        <EditorToolbar
          onToggle={handleToggle}
          currentStyle={{
            inline: editorState.getCurrentInlineStyle(),
            block: RichUtils.getCurrentBlockType(editorState),
          }}
        />
      )}
      <Box
        onClick={focusEditor}
        sx={{
          minHeight,
          padding: 2,
          cursor: readOnly ? 'default' : 'text',
          '& .DraftEditor-root': {
            height: '100%',
          },
          '& .public-DraftEditorPlaceholder-root': {
            color: 'text.secondary',
            position: 'absolute',
            padding: '8px',
          },
          '& .public-DraftEditor-content': {
            minHeight: minHeight - 32, // Adjust for padding
          },
        }}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleChange}
          onBlur={handleBlur}
          handleKeyCommand={handleKeyCommand}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={true}
        />
      </Box>
    </Paper>
  );
}