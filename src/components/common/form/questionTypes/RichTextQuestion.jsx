import React from "react";
import { Box, IconButton } from "@mui/material";
import { Info } from 'lucide-react';
import { RichTextEditor } from "../RichTextEditor/RichTextEditor";
import { FormField } from "../FormField";
import { getPlainText } from "../../../../utils/richTextUtils";

export function RichTextQuestion({ question, value, onChange, onInfoClick }) {
  const handleEditorChange = React.useCallback(
    (editorContent) => {
      if (editorContent !== value) {
        onChange(question.id, editorContent);
      }
    },
    [question.id, onChange, value]
  );

  const validateContent = () => {
    if (question.required && (!value || value === "{}")) {
      return "This field is required";
    }

    if (question.minLength || question.maxLength) {
      const plainText = getPlainText(value);

      if (question.minLength && plainText.length < question.minLength) {
        return `Minimum ${question.minLength} characters required`;
      }

      if (question.maxLength && plainText.length > question.maxLength) {
        return `Maximum ${question.maxLength} characters allowed`;
      }
    }

    return null;
  };

  const error = validateContent();

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FormField question={question} error={error} helperText={question.helpText}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton size="small" onClick={() => onInfoClick?.(question)}>
              <Info size={20} />
            </IconButton>
          </Box>
          <RichTextEditor
            value={value}
            onChange={handleEditorChange}
            placeholder={question.placeholder}
            minHeight={question.minHeight || 300}
            error={Boolean(error)}
          />
        </FormField>
      </Box>
    </Box>
  );
}