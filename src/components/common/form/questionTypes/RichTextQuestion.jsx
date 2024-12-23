import React from "react";
import { Box } from "@mui/material";
import { RichTextEditor } from "../RichTextEditor";
import { FormField } from "../FormField";

export function RichTextQuestion({ question, value, onChange }) {
	const handleEditorChange = React.useCallback(
		(content) => {
			onChange(question.id, content);
		},
		[question.id, onChange]
	);

	return (
		<Box sx={{ width: "100%" }}>
			<FormField
				label={question.title}
				required={question.required}
				error={question.error}
				helperText={question.helpText}
			>
				<RichTextEditor
					value={value}
					onChange={handleEditorChange}
					placeholder={question.placeholder}
					minHeight={question.minHeight || 200}
				/>
			</FormField>
		</Box>
	);
}
