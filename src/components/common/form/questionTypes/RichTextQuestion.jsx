import React from "react";
import { Box } from "@mui/material";
import { RichTextEditor } from "../RichTextEditor/RichTextEditor";
import { FormField } from "../FormField";
import { getPlainText, createEditorState, convertEditorStateToRaw } from "../../../../utils/richTextUtils";

export function RichTextQuestion({ question, value, onChange }) {
	const handleEditorChange = React.useCallback(
		(editorContent) => {
			// Only update if content actually changed
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
			<FormField question={question} error={error} helperText={question.helpText}>
				<RichTextEditor
					value={value}
					onChange={handleEditorChange}
					placeholder={question.placeholder}
					minHeight={question.minHeight || 300}
					error={Boolean(error)}
				/>
			</FormField>
		</Box>
	);
}
